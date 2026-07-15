package com.mobile

import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object ApiService {

    private const val BASE_URL = "https://prueba-tecnica-daviplata.onrender.com/api/v1"
    private const val TIMEOUT_MS = 10000

    fun login(phone: String, password: String): String {
        val url = "$BASE_URL/auth/login"
        val payload = JSONObject().apply {
            put("phone", phone)
            put("password", password)
        }
        return post(url, payload.toString())
    }

    fun getBalance(userId: String): Double {
        val url = "$BASE_URL/account/balance?user_id=$userId"
        val response = get(url)
        val json = JSONObject(response)
        return json.getDouble("balance")
    }

    fun getMovements(userId: String): String {
        val url = "$BASE_URL/movements?user_id=$userId"
        return get(url)
    }

    fun createTransfer(userId: String, amount: Double, destinationPhone: String): String {
        val url = "$BASE_URL/transfers"
        val payload = JSONObject().apply {
            put("user_id", userId)
            put("amount", amount)
            put("destination_phone", destinationPhone)
        }
        return post(url, payload.toString())
    }

    private fun post(urlStr: String, jsonBody: String): String {
        val url = URL(urlStr)
        val conn = url.openConnection() as HttpURLConnection
        try {
            conn.requestMethod = "POST"
            conn.connectTimeout = TIMEOUT_MS
            conn.readTimeout = TIMEOUT_MS
            conn.setRequestProperty("Content-Type", "application/json")
            conn.setRequestProperty("Accept", "application/json")
            conn.doOutput = true

            conn.outputStream.use { os ->
                OutputStreamWriter(os, Charsets.UTF_8).use { writer ->
                    writer.write(jsonBody)
                    writer.flush()
                }
            }

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                return conn.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } else {
                val errorText = conn.errorStream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() } ?: ""
                throw Exception(parseError(errorText, "HTTP Error $responseCode"))
            }
        } finally {
            conn.disconnect()
        }
    }

    private fun get(urlStr: String): String {
        val url = URL(urlStr)
        val conn = url.openConnection() as HttpURLConnection
        try {
            conn.requestMethod = "GET"
            conn.connectTimeout = TIMEOUT_MS
            conn.readTimeout = TIMEOUT_MS
            conn.setRequestProperty("Accept", "application/json")

            val responseCode = conn.responseCode
            if (responseCode in 200..299) {
                return conn.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
            } else {
                val errorText = conn.errorStream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() } ?: ""
                throw Exception(parseError(errorText, "HTTP Error $responseCode"))
            }
        } finally {
            conn.disconnect()
        }
    }

    private fun parseError(jsonStr: String, defaultMsg: String): String {
        if (jsonStr.isBlank()) return defaultMsg
        return try {
            JSONObject(jsonStr).optString("error", defaultMsg)
        } catch (e: Exception) {
            defaultMsg
        }
    }
}
