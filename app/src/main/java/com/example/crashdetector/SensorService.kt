package com.example.crashdetector

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import kotlin.math.sqrt

class SensorService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelValues: FloatArray? = null
    private var gyroValues: FloatArray? = null

    private var lastCrashTime = 0L
    private val crashDebounceMs = 2000 // 2 seconds between detections

    // Low-pass filter state
    private var filteredAccel = 0f
    private var filteredGyro = 0f
    private val alpha = 0.8f // smoothing factor

    // Require sustained crash readings
    private var consecutiveCrashReadings = 0
    private val requiredConsecutiveReadings = 3

    override fun onCreate() {
        super.onCreate()
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager

        sensorManager.registerListener(
            this,
            sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
            SensorManager.SENSOR_DELAY_GAME
        )
        sensorManager.registerListener(
            this,
            sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE),
            SensorManager.SENSOR_DELAY_GAME
        )

        startForegroundService()
    }

    private fun startForegroundService() {
        val channelId = "CrashDetectorChannel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Crash Detector",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Crash Detector Running")
            .setContentText("Monitoring for possible crashes")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .build()

        startForeground(1, notification)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return

        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> accelValues = event.values.clone()
            Sensor.TYPE_GYROSCOPE -> gyroValues = event.values.clone()
        }

        if (accelValues != null && gyroValues != null) {
            val accelMagnitude = sqrt(
                (accelValues!![0] * accelValues!![0] +
                        accelValues!![1] * accelValues!![1] +
                        accelValues!![2] * accelValues!![2]).toDouble()
            ).toFloat()

            val gyroMagnitude = sqrt(
                (gyroValues!![0] * gyroValues!![0] +
                        gyroValues!![1] * gyroValues!![1] +
                        gyroValues!![2] * gyroValues!![2]).toDouble()
            ).toFloat()

            // Load Test Mode state
            val prefs = getSharedPreferences("CrashDetectorPrefs", Context.MODE_PRIVATE)
            val testMode = prefs.getBoolean("test_mode", false)

            // Thresholds (stricter in normal mode)
            val accelThreshold = if (testMode) 15f else 50f
            val gyroThreshold  = if (testMode) 10f  else 30f

            // Apply low-pass filter
            filteredAccel = alpha * filteredAccel + (1 - alpha) * accelMagnitude
            filteredGyro  = alpha * filteredGyro  + (1 - alpha) * gyroMagnitude

            val now = System.currentTimeMillis()

            if (filteredAccel > accelThreshold && filteredGyro > gyroThreshold) {
                consecutiveCrashReadings++
                if (consecutiveCrashReadings >= requiredConsecutiveReadings &&
                    now - lastCrashTime > crashDebounceMs) {

                    lastCrashTime = now
                    consecutiveCrashReadings = 0
                    Log.d("SensorService", "🚨 Crash detected! testMode=$testMode accel=$filteredAccel gyro=$filteredGyro")
                    showOverlay()
                }
            } else {
                // reset counter if condition not met
                consecutiveCrashReadings = 0
            }
        }
    }

    private fun showOverlay() {
        val intent = Intent(this, OverlayActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        intent.putExtra("fromService", true) // OverlayActivity uses dialog theme
        startActivity(intent)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
    }
}
