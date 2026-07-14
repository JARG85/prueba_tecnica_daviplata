package com.mobile

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.animation.DecelerateInterpolator
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class SplashActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "SplashActivity"
        private const val SPLASH_DELAY_MS = 1800L
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // Find views for animation
        val splashLogo = findViewById<ImageView>(R.id.splash_logo)

        // Perform fade-in & scale animation for the Davivienda Logo
        splashLogo?.apply {
            alpha = 0f
            scaleX = 0.7f
            scaleY = 0.7f
            animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(800)
                .setInterpolator(DecelerateInterpolator())
                .start()
        }

        // Delay navigation to show the branding and finish loading
        Handler(Looper.getMainLooper()).postDelayed({
            checkSessionAndNavigate()
        }, SPLASH_DELAY_MS)
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

