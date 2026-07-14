package com.mobile

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.json.JSONArray

class MovimientosActivity : ReactActivity() {

    companion object {
        private const val TAG = "MovimientosActivity"
    }

    override fun getMainComponentName(): String = "MovimientosBundle"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
            override fun getLaunchOptions(): Bundle {
                val launchOptions = Bundle()
                try {
                    val movementsJson = DataManager.getMovements(this@MovimientosActivity)
                    val list = jsonArrayToBundleList(movementsJson)
                    launchOptions.putParcelableArrayList("movements", list)
                    Log.d(TAG, "Passing initial props (movements) to MovimientosBundle. Count: ${list.size}")
                } catch (e: Exception) {
                    Log.e(TAG, "Error generating launch options for MovimientosBundle", e)
                }
                return launchOptions
            }
        }
    }

    private fun jsonArrayToBundleList(jsonArrayStr: String): ArrayList<Bundle> {
        val list = ArrayList<Bundle>()
        try {
            val array = JSONArray(jsonArrayStr)
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                val bundle = Bundle().apply {
                    putString("id", obj.optString("id", ""))
                    putString("date", obj.optString("date", ""))
                    putString("type", obj.optString("type", "DEBITO"))
                    putDouble("value", obj.optDouble("value", 0.0))
                    putString("description", obj.optString("description", ""))
                    putString("status", obj.optString("status", ""))
                }
                list.add(bundle)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing JSON array to Bundle list", e)
        }
        return list
    }
}
