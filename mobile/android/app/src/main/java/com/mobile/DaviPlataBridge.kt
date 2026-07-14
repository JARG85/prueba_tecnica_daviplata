package com.mobile

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONObject
import org.json.JSONArray

class DaviPlataBridge(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "DaviPlataBridge"

    companion object {
        private const val TAG = "DaviPlataBridge"
        private var instance: DaviPlataBridge? = null

        fun getInstance(): DaviPlataBridge? = instance

        fun sendEvent(eventName: String, params: WritableMap?) {
            instance?.let { bridge ->
                if (bridge.reactContext.hasActiveCatalystInstance()) {
                    bridge.reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit(eventName, params)
                    Log.d(TAG, "Sent event $eventName with params: $params")
                } else {
                    Log.w(TAG, "React Context not active, cannot send event $eventName")
                }
            }
        }
    }

    init {
        instance = this
    }

    @ReactMethod
    fun login(phone: String, password: String, promise: Promise) {
        Thread {
            try {
                val sessionJson = ApiService.login(phone, password)
                val activity = reactContext.currentActivity
                
                if (activity != null) {
                    SecurityManager.saveSession(activity, sessionJson)
                    activity.runOnUiThread {
                        val intent = Intent(activity, HomeActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        }
                        activity.startActivity(intent)
                        activity.finish()
                    }
                    promise.resolve(true)
                } else {
                    promise.reject("ACTIVITY_ERROR", "Contexto de actividad no disponible")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Login fallido", e)
                promise.reject("LOGIN_ERROR", e.message ?: "Credenciales inválidas o error de conexión")
            }
        }.start()
    }

    @ReactMethod
    fun sendTransfer(destinationPhone: String, amount: Double, description: String, promise: Promise) {
        Thread {
            val activity = reactContext.currentActivity
            if (activity == null) {
                promise.reject("ACTIVITY_ERROR", "Contexto de actividad no disponible")
                return@Thread
            }

            try {
                val sessionStr = SecurityManager.getSession(activity)
                if (sessionStr == null) {
                    promise.reject("SESSION_ERROR", "Sesión no activa")
                    return@Thread
                }
                val sessionObj = JSONObject(sessionStr)
                val userId = sessionObj.getString("userId")

                // Perform transfer on backend
                ApiService.createTransfer(userId, amount, destinationPhone)

                // Get fresh balance from backend
                val newBalance = ApiService.getBalance(userId)
                DataManager.updateBalance(activity, newBalance)

                // Add local movement record for completeness
                DataManager.addMovement(
                    context = activity,
                    type = "DEBITO",
                    value = amount,
                    description = "Envío a cel $destinationPhone - $description",
                    status = "Exitosa"
                )

                // Emit event to update Home screen
                val params = Arguments.createMap().apply {
                    putString("name", sessionObj.optString("name", "Usuario"))
                    putString("phone", sessionObj.optString("phone", ""))
                    putDouble("balance", newBalance)
                }
                activity.runOnUiThread {
                    sendEvent("LOAD_HOME", params)
                    activity.finish()
                }
                promise.resolve("Transferencia realizada con éxito")
            } catch (e: Exception) {
                Log.e(TAG, "Transferencia fallida", e)
                promise.reject("TRANSFER_ERROR", e.message ?: "Error al procesar transferencia")
            }
        }.start()
    }

    @ReactMethod
    fun getMovements(promise: Promise) {
        Thread {
            val activity = reactContext.currentActivity
            if (activity == null) {
                promise.reject("ACTIVITY_ERROR", "Contexto de actividad no disponible")
                return@Thread
            }

            try {
                val sessionStr = SecurityManager.getSession(activity)
                if (sessionStr == null) {
                    promise.reject("SESSION_ERROR", "Sesión no activa")
                    return@Thread
                }
                val sessionObj = JSONObject(sessionStr)
                val userId = sessionObj.getString("userId")

                val movementsJsonStr = ApiService.getMovements(userId)
                val jsonArray = JSONArray(movementsJsonStr)
                
                val writableArray = jsonArrayToWritableArray(jsonArray)
                promise.resolve(writableArray)
            } catch (e: Exception) {
                Log.e(TAG, "Error cargando movimientos", e)
                promise.reject("MOVEMENTS_ERROR", e.message ?: "Error al cargar movimientos")
            }
        }.start()
    }

    @ReactMethod
    fun sendLoginSuccess(sessionJson: String) {
        Log.d(TAG, "sendLoginSuccess called with $sessionJson")
        val activity = reactContext.currentActivity ?: return
        SecurityManager.saveSession(activity, sessionJson)
        val intent = Intent(activity, HomeActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        activity.startActivity(intent)
        activity.finish()
    }

    @ReactMethod
    fun openTransfer() {
        Log.d(TAG, "openTransfer called")
        val activity = reactContext.currentActivity ?: return
        val intent = Intent(activity, TransferenciaActivity::class.java)
        activity.startActivity(intent)
    }

    @ReactMethod
    fun openMovements() {
        Log.d(TAG, "openMovements called")
        val activity = reactContext.currentActivity ?: return
        val intent = Intent(activity, MovimientosActivity::class.java)
        activity.startActivity(intent)
    }

    @ReactMethod
    fun sendTransferSuccess(transferJson: String) {
        Log.d(TAG, "sendTransferSuccess called with $transferJson")
        val activity = reactContext.currentActivity ?: return
        try {
            val transferObj = JSONObject(transferJson)
            val destinationPhone = transferObj.getString("destinationPhone")
            val amount = transferObj.getDouble("amount")
            val description = transferObj.optString("description", "Transferencia")

            val currentBalance = DataManager.getBalance(activity)
            val newBalance = currentBalance - amount
            DataManager.updateBalance(activity, newBalance)

            DataManager.addMovement(
                context = activity,
                type = "DEBITO",
                value = amount,
                description = "Envío a cel $destinationPhone - $description",
                status = "Exitosa"
            )

            activity.finish()

            val sessionStr = SecurityManager.getSession(activity)
            if (sessionStr != null) {
                val sessionObj = JSONObject(sessionStr)
                val params = Arguments.createMap().apply {
                    putString("name", sessionObj.optString("name", "Usuario"))
                    putString("phone", sessionObj.optString("phone", ""))
                    putDouble("balance", newBalance)
                }
                sendEvent("LOAD_HOME", params)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error processing transfer success", e)
        }
    }

    @ReactMethod
    fun closeActivity() {
        val activity = reactContext.currentActivity ?: return
        activity.finish()
    }

    @ReactMethod
    fun sendLogout() {
        Log.d(TAG, "sendLogout called")
        val activity = reactContext.currentActivity ?: return
        
        SecurityManager.clearSession(activity)
        DataManager.clearData(activity)
        
        val intent = Intent(activity, LoginActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        activity.startActivity(intent)
        activity.finish()
    }

    private fun jsonArrayToWritableArray(jsonArray: JSONArray): WritableArray {
        val writableArray = Arguments.createArray()
        for (i in 0 until jsonArray.length()) {
            when (val value = jsonArray.get(i)) {
                is JSONObject -> writableArray.pushMap(jsonObjectToWritableMap(value))
                is JSONArray -> writableArray.pushArray(jsonArrayToWritableArray(value))
                is Boolean -> writableArray.pushBoolean(value)
                is Int -> writableArray.pushInt(value)
                is Long -> writableArray.pushDouble(value.toDouble())
                is Double -> writableArray.pushDouble(value)
                is String -> writableArray.pushString(value)
                else -> {
                    if (value == JSONObject.NULL) {
                        writableArray.pushNull()
                    } else {
                        writableArray.pushString(value.toString())
                    }
                }
            }
        }
        return writableArray
    }

    private fun jsonObjectToWritableMap(jsonObject: JSONObject): WritableMap {
        val writableMap = Arguments.createMap()
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            when (val value = jsonObject.get(key)) {
                is JSONObject -> writableMap.putMap(key, jsonObjectToWritableMap(value))
                is JSONArray -> writableMap.putArray(key, jsonArrayToWritableArray(value))
                is Boolean -> writableMap.putBoolean(key, value)
                is Int -> writableMap.putInt(key, value)
                is Long -> writableMap.putDouble(key, value.toDouble())
                is Double -> writableMap.putDouble(key, value)
                is String -> writableMap.putString(key, value)
                else -> {
                    if (value == JSONObject.NULL) {
                        writableMap.putNull(key)
                    } else {
                        writableMap.putString(key, value.toString())
                    }
                }
            }
        }
        return writableMap
    }
}

