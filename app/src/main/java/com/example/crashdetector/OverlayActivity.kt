package com.example.crashdetector

import android.os.Build
import android.os.Bundle
import android.os.CountDownTimer
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class OverlayActivity : AppCompatActivity() {

    private var countDownTimer: CountDownTimer? = null
    private lateinit var countdownText: TextView
    private lateinit var btnSendNow: Button
    private lateinit var btnCancel: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 🟢 Make sure this window floats above all other apps
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            window.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY)
        } else {
            @Suppress("DEPRECATION")
            window.setType(WindowManager.LayoutParams.TYPE_PHONE)
        }

        // Prevent the overlay from being dismissed by touches outside
        window.addFlags(
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                    WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
        )

        setContentView(R.layout.overlay_layout)

        countdownText = findViewById(R.id.tv_countdown)
        btnSendNow = findViewById(R.id.btn_send_now)
        btnCancel = findViewById(R.id.btn_cancel)

        // Start the 10-second countdown
        startCountdown()

        // If user clicks "Send Now"
        btnSendNow.setOnClickListener {
            countDownTimer?.cancel() // stop the countdown
            SmsUtils.sendEmergency(this, false) // send SMS immediately
            finishAffinity() // close overlay & return to home screen
        }

        // If user clicks "Cancel"
        btnCancel.setOnClickListener {
            countDownTimer?.cancel()
            finish() // just close overlay, no SMS sent
        }
    }

    private fun startCountdown() {
        countDownTimer = object : CountDownTimer(10_000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val seconds = millisUntilFinished / 1000
                countdownText.text = "Sending SMS in $seconds seconds..."
            }

            override fun onFinish() {
                // Auto send SMS after countdown finishes
                SmsUtils.sendEmergency(this@OverlayActivity, false)
                finishAffinity() // close overlay & return to home
            }
        }
        countDownTimer?.start()
    }

    override fun onDestroy() {
        super.onDestroy()
        countDownTimer?.cancel()
    }
}
