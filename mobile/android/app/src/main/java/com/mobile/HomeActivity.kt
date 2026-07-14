package com.mobile

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
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
                } catch (e: Exception) {
                    Log.e(TAG, "Error generating launch options for HomeBundle", e)
                }
                return launchOptions
            }
        }
    }
}
