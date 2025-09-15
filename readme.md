# 🚗 CrashGuard – Smart Accident Detection & Emergency Alert System

CrashGuard is a mobile application that helps save lives by **detecting road accidents in real-time** using smartphone sensors such as the **accelerometer**, **gyroscope**, and **proximity sensor**.  
When a crash is detected, the app automatically alerts the user’s **emergency contact** through a **call and SMS** containing the user’s location.  

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [How It Works](#-how-it-works)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

- 📱 **Sensor Monitoring**  
  Continuously monitors smartphone sensors (accelerometer, gyroscope, proximity).  

- 🚨 **Crash Detection**  
  Detects sudden changes in speed, orientation, or motion patterns that may indicate a crash.  

- ⏳ **Safety Countdown**  
  A **10-second cancel prompt** is displayed before triggering alerts, giving the user time to stop false alarms.  

- 📞 **Emergency Alerts**  
  Automatically places a **phone call** and sends an **SMS with location details** to the registered emergency contact.  

- 🎨 **Modern UI**  
  Simple, clean, and user-friendly design for quick setup and use.  

- 🔋 **Background Service**  
  Runs silently in the background with minimal battery usage.  

---

## 🛠️ Tech Stack

- **Frontend (Mobile App):** Kotlin (Android)  
- **Backend (Optional for logging & analytics):** Node.js + Express  
- **Database:** SQLite / Firebase (for storing user settings & contacts)  
- **APIs & Services:**  
  - Android Telephony Manager  
  - Android Location Services  
  - Google Maps API (optional for advanced location sharing)  

---

## 🚀 Installation & Setup

### Prerequisites
- Android Studio installed  
- Android device/emulator with SMS & call functionality  
- Git installed  

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/username/CrashGuard.git
   cd CrashGuard
