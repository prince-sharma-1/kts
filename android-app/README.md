# KTS Academy Android app

This native Android WebView app bundles the website in `app/src/main/assets/www`.

## Build an APK

1. Install Android Studio (with Android SDK 35).
2. Open the `android-app` folder as an Android Studio project.
3. Allow the Gradle sync to finish.
4. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

The debug APK will be created at `app/build/outputs/apk/debug/app-debug.apk`.

Before a Play Store release, change the package ID if needed, create a signing key,
and build a signed Android App Bundle or release APK.
