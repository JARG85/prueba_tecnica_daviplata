package com.mobile

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

object DataManager {

    private const val PREFS_NAME = "DaviPlataDataPrefs"
    private const val KEY_BALANCE = "user_balance"
    private const val KEY_MOVEMENTS = "user_movements"

    fun getBalance(context: Context): Double {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getFloat(KEY_BALANCE, 100000.0f).toDouble()
    }

    fun updateBalance(context: Context, newBalance: Double) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putFloat(KEY_BALANCE, newBalance.toFloat()).apply()
    }

    fun getMovements(context: Context): String {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val defaultMovements = JSONArray().apply {
            put(JSONObject().apply {
                put("id", "m1")
                put("date", getIsoTimestamp())
                put("type", "CREDITO")
                put("value", 100000.0)
                put("description", "Saldo inicial de DaviPlata")
                put("status", "Exitosa")
            })
        }
        return prefs.getString(KEY_MOVEMENTS, defaultMovements.toString()) ?: defaultMovements.toString()
    }

    fun addMovement(context: Context, type: String, value: Double, description: String, status: String) {
        try {
            val movementsStr = getMovements(context)
            val movementsArray = JSONArray(movementsStr)
            
            val newMovement = JSONObject().apply {
                put("id", "m" + System.currentTimeMillis())
                put("date", getIsoTimestamp())
                put("type", type)
                put("value", value)
                put("description", description)
                put("status", status)
            }

            val newArray = JSONArray()
            newArray.put(newMovement)
            for (i in 0 until movementsArray.length()) {
                newArray.put(movementsArray.get(i))
            }

            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().putString(KEY_MOVEMENTS, newArray.toString()).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun clearData(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().clear().apply()
    }

    private fun getIsoTimestamp(): String {
        val df = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
        df.timeZone = TimeZone.getTimeZone("UTC")
        return df.format(Date())
    }
}
