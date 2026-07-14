package com.mobile

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.json.JSONObject

class TransferenciaActivity : ReactActivity() {

    companion object {
        private const val TAG = "TransferenciaActivity"
    }

    override fun getMainComponentName(): String = "TransferenciaBundle"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
            override fun getLaunchOptions(): Bundle {
                val launchOptions = Bundle()
                try {
                    val sessionJson = SecurityManager.getSession(this@TransferenciaActivity)
                    if (sessionJson != null) {
                        val sessionObj = JSONObject(sessionJson)
                        launchOptions.putString("currentPhone", sessionObj.optString("phone", ""))
                    }
                    launchOptions.putDouble("balance", DataManager.getBalance(this@TransferenciaActivity))
                    Log.d(TAG, "Passing initial props to TransferenciaBundle: $launchOptions")
                } catch (e: Exception) {
                    Log.e(TAG, "Error generating launch options for TransferenciaBundle", e)
                }
                return launchOptions
            }
        }
    }
}
