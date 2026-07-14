package com.mobile

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.json.JSONObject

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
}
