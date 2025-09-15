package com.example.crashdetector
import android.widget.ImageButton

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var etEmergencyContacts: EditText
    private lateinit var btnSaveContacts: ImageButton

    private lateinit var switchTestMode: Switch
    private lateinit var btnSOS: Button

    private val PERMISSION_REQUEST_CODE = 100
    private val OVERLAY_PERMISSION_REQUEST_CODE = 1234

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        etEmergencyContacts = findViewById(R.id.etEmergencyContacts)
        btnSaveContacts = findViewById(R.id.btnSaveContacts)
        switchTestMode = findViewById(R.id.switchTestMode)
        btnSOS = findViewById(R.id.btnSos)

        val prefs = getSharedPreferences("CrashDetectorPrefs", Context.MODE_PRIVATE)

        // Load saved contacts
        etEmergencyContacts.setText(prefs.getString("emergency_contacts", ""))

        // Load saved test mode state
        val savedTestMode = prefs.getBoolean("test_mode", false)
        switchTestMode.isChecked = savedTestMode

        // Save contacts
        btnSaveContacts.setOnClickListener {
            val contacts = etEmergencyContacts.text.toString()
            prefs.edit().putString("emergency_contacts", contacts).apply()
            Toast.makeText(this, "Contacts saved!", Toast.LENGTH_SHORT).show()
        }

        // Toggle test mode
        switchTestMode.setOnCheckedChangeListener { _, isChecked ->
            prefs.edit().putBoolean("test_mode", isChecked).apply()
            val msg = if (isChecked) "✅ Test Mode Enabled (shake to simulate crash)"
            else "🚗 Test Mode Disabled (real crash thresholds)"
            Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
        }

        

        // Manual SOS button
        btnSOS.setOnClickListener {
            if (checkAndRequestPermissions()) {
                SmsUtils.sendEmergency(this, true)
            }
        }

        // Start crash detection service
        if (checkAndRequestPermissions() && checkOverlayPermission()) {
            startCrashDetectionService()
        }
    }

    private fun checkAndRequestPermissions(): Boolean {
        val permissionsNeeded = mutableListOf<String>()

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS)
            != PackageManager.PERMISSION_GRANTED
        ) permissionsNeeded.add(Manifest.permission.SEND_SMS)

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE)
            != PackageManager.PERMISSION_GRANTED
        ) permissionsNeeded.add(Manifest.permission.READ_PHONE_STATE)

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED
        ) permissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION)

        return if (permissionsNeeded.isNotEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                permissionsNeeded.toTypedArray(),
                PERMISSION_REQUEST_CODE
            )
            false
        } else {
            true
        }
    }

    private fun checkOverlayPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName")
                )
                startActivityForResult(intent, OVERLAY_PERMISSION_REQUEST_CODE)
                false
            } else {
                true
            }
        } else {
            true
        }
    }

    private fun startCrashDetectionService() {
        val intent = Intent(this, SensorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(this, intent)
        } else {
            startService(intent)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == OVERLAY_PERMISSION_REQUEST_CODE) {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this)) {
                startCrashDetectionService()
            } else {
                Toast.makeText(this, "Overlay permission required!", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                if (checkOverlayPermission()) {
                    startCrashDetectionService()
                }
            } else {
                Toast.makeText(this, "All permissions are required!", Toast.LENGTH_LONG).show()
            }
        }
    }
}
