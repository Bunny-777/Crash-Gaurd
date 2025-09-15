package com.example.crashdetector

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.telephony.SmsManager
import android.telephony.SubscriptionManager
import android.util.Log
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource

object SmsUtils {

    private const val TAG = "SmsUtils"

    @SuppressLint("MissingPermission") // runtime perms must be granted before calling
    fun sendEmergency(context: Context, isManual: Boolean) {
        val prefs = context.getSharedPreferences("CrashDetectorPrefs", Context.MODE_PRIVATE)
        val raw = prefs.getString("emergency_contacts", "") ?: ""

        // Accept commas, spaces, or newlines; keep only digits and leading '+'
        val contacts = raw
            .split(',', '\n', ' ')
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            .map { cleanNumber(it) }
            .filter { it.length >= 10 }
            .distinct()

        if (contacts.isEmpty()) {
            Log.e(TAG, "❌ No valid emergency contacts.")
            Toast.makeText(context, "No valid emergency contacts.", Toast.LENGTH_LONG).show()
            return
        }

        val appContext = context.applicationContext
        val fused = LocationServices.getFusedLocationProviderClient(appContext)

        fused.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, CancellationTokenSource().token)
            .addOnCompleteListener { task ->
                val location = task.result
                val locationUrl = if (task.isSuccessful && location != null) {
                    "https://maps.google.com/?q=${location.latitude},${location.longitude}"
                } else {
                    Log.w(TAG, "⚠️ Could not get location. Sending SMS without it.")
                    "Location unavailable"
                }

                val message = if (isManual) {
                    "SOS: I need help. Location: $locationUrl"
                } else {
                    "Possible crash detected. Check my location: $locationUrl"
                }

                Log.d(TAG, "✉️ Prepared message (${message.length} chars): $message")
                sendSmsToAll(appContext, contacts, message)
            }
    }

    private fun cleanNumber(n: String): String {
        val trimmed = n.trim()
        return if (trimmed.startsWith("+")) {
            "+" + trimmed.drop(1).filter { it.isDigit() }
        } else {
            trimmed.filter { it.isDigit() }
        }
    }

    private fun getPreferredSmsManager(context: Context): SmsManager {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                val subMgr = ContextCompat.getSystemService(context, SubscriptionManager::class.java)

                // Use reflection for defaultSmsSubscriptionId (avoids compile error on minSdk 22)
                val subId: Int = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    try {
                        val field = SubscriptionManager::class.java.getDeclaredField("defaultSmsSubscriptionId")
                        field.getInt(null)
                    } catch (e: Exception) {
                        SubscriptionManager.INVALID_SUBSCRIPTION_ID
                    }
                } else {
                    SubscriptionManager.INVALID_SUBSCRIPTION_ID
                }

                if (subId != SubscriptionManager.INVALID_SUBSCRIPTION_ID) {
                    SmsManager.getSmsManagerForSubscriptionId(subId)
                } else {
                    SmsManager.getDefault()
                }
            } else {
                SmsManager.getDefault()
            }
        } catch (e: Exception) {
            Log.w(TAG, "Falling back to default SmsManager: ${e.message}")
            SmsManager.getDefault()
        }
    }

    private fun sendSmsToAll(context: Context, contacts: List<String>, message: String) {
        val smsManager = getPreferredSmsManager(context)
        val parts = smsManager.divideMessage(message)
        var successCount = 0

        for (number in contacts) {
            try {
                if (parts.size <= 1) {
                    Log.i(TAG, "➡ Sending single-part SMS to $number")
                    smsManager.sendTextMessage(number, null, message, null, null)
                } else {
                    Log.i(TAG, "➡ Sending multipart SMS (${parts.size} parts) to $number")
                    smsManager.sendMultipartTextMessage(number, null, parts, null, null)
                }
                successCount++
            } catch (e: SecurityException) {
                Log.e(TAG, "❌ SecurityException for $number (missing permission?): ${e.message}", e)
            } catch (e: Exception) {
                Log.e(TAG, "❌ Failed to send SMS to $number: ${e.message}", e)
            }
        }

        if (successCount > 0) {
            val ok = "✅ Emergency message sent to $successCount contact(s)."
            Log.i(TAG, ok)
            Toast.makeText(context, ok, Toast.LENGTH_LONG).show()
        } else {
            val fail = "❌ Failed to send emergency message."
            Log.e(TAG, fail)
            Toast.makeText(context, fail, Toast.LENGTH_LONG).show()
        }
    }
}
