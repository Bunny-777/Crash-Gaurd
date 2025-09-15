package com.example.crashdetector

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.util.Log
import android.widget.Toast
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

object LocationUtils {

    private const val TAG = "LocationUtils"

    @SuppressLint("MissingPermission") // we handle permission manually
    fun getLastLocation(context: Context, callback: (String) -> Unit) {
        val fusedLocationClient: FusedLocationProviderClient =
            LocationServices.getFusedLocationProviderClient(context)

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(context, "❌ Location permission not granted", Toast.LENGTH_LONG).show()
            Log.e(TAG, "Location permission not granted")
            callback("Location unavailable")
            return
        }

        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                val url = "https://maps.google.com/?q=${location.latitude},${location.longitude}"
                callback(url)
            } else {
                callback("Location unavailable")
            }
        }.addOnFailureListener {
            callback("Location unavailable")
        }
    }
}
