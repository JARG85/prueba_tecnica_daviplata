package com.mobile

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.json.JSONObject

class HomeActivity : ReactActivity() {

    companion object {
        private const val TAG = "HomeActivity"
    }

    override fun getMainComponentName(): String = "HomeBundle"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
            override fun getLaunchOptions(): Bundle {
                val launchOptions = Bundle()
                try {
                    val sessionJson = SecurityManager.getSession(this@HomeActivity)
                    if (sessionJson != null) {
                        val sessionObj = JSONObject(sessionJson)
                        launchOptions.putString("name", sessionObj.optString("name", "Usuario"))
                        launchOptions.putString("phone", sessionObj.optString("phone", ""))
                    }
                    launchOptions.putDouble("balance", DataManager.getBalance(this@HomeActivity))
                    Log.d(TAG, "Passing initial props to HomeBundle: $launchOptions")
                    
                    // Trigger background refresh of balance from the server
                    refreshBalanceInBackground()
                } catch (e: Exception) {
                    Log.e(TAG, "Error generating launch options for HomeBundle", e)
                }
                return launchOptions
            }
        }
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume called - refreshing balance in background")
        refreshBalanceInBackground()
    }

    private fun refreshBalanceInBackground() {
        Thread {
            try {
                val sessionJson = SecurityManager.getSession(this) ?: return@Thread
                val sessionObj = JSONObject(sessionJson)
                val userId = sessionObj.getString("userId")
                
                // Fetch fresh balance from Rails API
                val freshBalance = ApiService.getBalance(userId)
                DataManager.updateBalance(this, freshBalance)
                
                // Prepare arguments to notify React Native
                val params = Arguments.createMap().apply {
                    putString("name", sessionObj.optString("name", "Usuario"))
                    putString("phone", sessionObj.optString("phone", ""))
                    putDouble("balance", freshBalance)
                }
                
                // Emit event through the bridge
                DaviPlataBridge.sendEvent("LOAD_HOME", params)
                Log.d(TAG, "Successfully refreshed balance in background from API: $freshBalance")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to refresh balance in background", e)
            }
        }.start()
    }
}

