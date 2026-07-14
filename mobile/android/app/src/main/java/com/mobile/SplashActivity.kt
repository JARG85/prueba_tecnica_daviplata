package com.mobile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class SplashActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "SplashActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkSessionAndNavigate()
    }

    private fun checkSessionAndNavigate() {
        val sessionJson = SecurityManager.getSession(this)
        
        if (sessionJson != null && isSessionValid(sessionJson)) {
            Log.d(TAG, "Sesión válida encontrada. Redirigiendo a HomeActivity.")
            startActivity(Intent(this, HomeActivity::class.java))
        } else {
            Log.d(TAG, "Sesión no válida o expirada. Redirigiendo a LoginActivity.")
            SecurityManager.clearSession(this)
            startActivity(Intent(this, LoginActivity::class.java))
        }
        finish()
    }

    private fun isSessionValid(sessionJson: String): Boolean {
        return try {
            val obj = JSONObject(sessionJson)
            val expiresAtStr = obj.getString("expiresAt")
            
            val cleanStr = expiresAtStr.replace("Z", "")
            val pattern = if (cleanStr.contains(".")) "yyyy-MM-dd'T'HH:mm:ss.SSS" else "yyyy-MM-dd'T'HH:mm:ss"
            
            val sdf = SimpleDateFormat(pattern, Locale.getDefault()).apply {
                timeZone = TimeZone.getTimeZone("UTC")
            }
            val expiryDate = sdf.parse(cleanStr)
            expiryDate != null && expiryDate.after(Date())
        } catch (e: Exception) {
            Log.e(TAG, "Error validando expiración de sesión", e)
            false
        }
    }
}
