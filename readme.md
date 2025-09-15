# 🚗 CrashGuard – Smart Accident Detection & Emergency Alert System Application

## 📖 What is CrashGuard?

CrashGuard is a mobile application designed to **detect road accidents in real-time** using your smartphone’s built-in sensors such as the **accelerometer**, **gyroscope**, and **proximity sensor**.  

When a crash is detected, the app provides a **10-second prompt** allowing the user to cancel if it’s a false alarm. If not canceled, CrashGuard will **automatically call and send an SMS (with your live location)** to your registered emergency contact.  

⚡ CrashGuard aims to provide **fast response and immediate help** in emergency situations, potentially saving lives.  

---

## ✨ Features

- 📱 **Sensor Monitoring**  
  Continuously tracks data from accelerometer, gyroscope, and proximity sensors.  

- 🚨 **Crash Detection**  
  Detects sudden speed drops, unusual orientation changes, or impact movements.  

- ⏳ **Safety Countdown**  
  A **10-second cancel option** appears before emergency actions are triggered.  

- 📞 **Emergency Alerts**  
  If not canceled, the app:  
  - Calls the registered emergency contact  
  - Sends an SMS containing your live GPS location  

- 🎨 **User-Friendly UI**  
  Simple and modern design for easy setup and operation.  

- 🔋 **Background Service**  
  Runs silently in the background without interfering with normal phone use.  

---

## ⚙️ How Does It Work?

1. **Sensor Monitoring**  
   - Listens to accelerometer, gyroscope, and proximity sensor values in real time.  

2. **Crash Detection Algorithm**  
   - Detects abnormal acceleration/deceleration spikes.  
   - Detects sudden rotation or movement (roll, pitch, yaw).  
   - Confirms potential crash using multiple sensor inputs.  

3. **Safety Prompt**  
   - A warning screen with a **10-second countdown** appears.  
   - The user can cancel if it’s a false alarm.  

4. **Emergency Response**  
   - If not canceled:  
     ✅ Sends an SMS with live location  
     ✅ Automatically initiates a phone call to the saved emergency contact  

---

## 📸 Screenshots  

| Dashboard | Alert Screen | Contact Setup | Permissions |
|-----------|--------------|---------------|-------------|
| ![ss1](https://github.com/user-attachments/assets/33cd8188-5cd9-4343-a593-8ce3b540fb97) | ![ss2](https://github.com/user-attachments/assets/c2f5e611-0ca9-40a9-8cfb-dcaebda05e53) | ![ss3](https://github.com/user-attachments/assets/05e61df7-a2be-4259-ae80-9be892322ea5) | ![ss4](https://github.com/user-attachments/assets/ec49bb3d-1ac4-4521-9535-0258274a87d9) |

---

## 🚀 Setup Instructions



### 🛠️ Steps to Run

1.  **Clone the Repository** 📂
    * Open your terminal and run the following commands to clone the repository and navigate into the project directory:
        ```bash
        git clone https://github.com/Bunny-777/Crash-Gaurd.git 
        cd Crash-Gaurd
        ```

2.  **Open the Project in Android Studio** 💻
    * Launch **Android Studio**.
    * Select **File > Open** or **Open an Existing Project**.
    * Navigate to the location where you cloned the `Crash-Gaurd` folder and open it.

3.  **Sync Gradle Dependencies** 🔄
    * Android Studio will automatically detect the Gradle configuration.
    * If prompted, click on "**Sync Now**" in the notification bar that appears at the top of the editor to download all the necessary dependencies.

4.  **Connect Device or Start Emulator** 📱
    * **Physical Device:** For full functionality, connect a physical Android device that has active SMS & phone calling capabilities.
    * **Emulator:** Alternatively, you can configure and start an Android Emulator from the AVD Manager in Android Studio.

5.  **Run the Application** ▶️
    * **From Android Studio:** Click the **Run 'app'** button (▶) in the top toolbar.
    * **From the Terminal:** Use the following Gradle command to build and install the debug version of the app on the connected device/emulator:
        ```bash
        ./gradlew installDebug
        ```

6.  **Grant Necessary Permissions on First Launch** 🙏
    * When you open the application for the first time, you will be prompted to grant several permissions. These are essential for the app to work correctly. Please **Allow** them.
        * 📍 **Location Access:** To send your precise GPS coordinates in an emergency.
        * 📞 **Phone Calling:** To automatically dial your designated emergency contact.
        * ✉️ **SMS Sending:** To send crash alert text messages with your location link.
