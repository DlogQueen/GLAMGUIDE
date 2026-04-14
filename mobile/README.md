# Glam Guide AI - Mobile App

## Overview
Mobile version of Glam Guide AI using Capacitor to wrap the Next.js web app as native iOS/Android apps.

## Prerequisites
- Node.js 18+
- Android Studio (for Android builds)
- Xcode 14+ (for iOS builds, macOS only)
- Java 17 (for Android)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web App
```bash
npm run build
```

### 3. Add Mobile Platforms
```bash
# Add Android
npx cap add android

# Add iOS (macOS only)
npx cap add ios
```

### 4. Sync Web Build to Native
```bash
npx cap sync
```

## Development

### Android
```bash
# Open in Android Studio
npx cap open android

# Or build APK directly
npx cap build android
```

### iOS (macOS only)
```bash
# Open in Xcode
npx cap open ios

# Or build directly
npx cap build ios
```

## DeepAR Configuration

### Android Setup
1. Download DeepAR Android SDK from https://developer.deepar.ai
2. Extract to `android/app/libs/`
3. Add to `android/app/build.gradle`:
```gradle
dependencies {
    implementation files('libs/deepar.aar')
}
```

### iOS Setup
1. Download DeepAR iOS SDK
2. Add framework to Xcode project
3. Configure camera permissions in Info.plist

## API Keys
- **Web DeepAR**: `DEFAULT_DEEPAR_KEY` (for browser)
- **Android DeepAR**: `ANDROID_DEEPAR_KEY` (already configured in service)

## Permissions

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS (Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>Glam Guide AI needs camera access for AR makeup try-on</string>
```

## Build Release APK
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Testing
- Use Android emulator or physical device
- For AR features, physical device with camera required
- Minimum Android API 24 (Android 7.0)

## Troubleshooting
- Clear build: `npx cap clean`
- Re-sync: `npx cap sync --force`
- Check logs: `adb logcat` (Android)
