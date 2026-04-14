#!/bin/bash

# Glam Guide AI - Android Build Script
# Run this to build Android APK for testing/sideloading

set -e

# Get script directory and cd to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

echo "🚀 Glam Guide AI - Android Build"
echo "Working directory: $(pwd)"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Install with: sudo port install npm8${NC}"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Install with: sudo port install openjdk17${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install
npm install @capacitor/android

# Step 3: Build web app
echo -e "${YELLOW}Step 3: Building web app...${NC}"
npm run build

# Step 4: Add Android platform (if not exists)
echo -e "${YELLOW}Step 4: Setting up Android platform...${NC}"
if [ ! -d "android" ]; then
    npx cap add android
    echo -e "${GREEN}✓ Android platform added${NC}"
else
    echo -e "${GREEN}✓ Android platform already exists${NC}"
fi

# Step 5: Sync web code to Android
echo -e "${YELLOW}Step 5: Syncing code to Android...${NC}"
npx cap sync android

# Step 6: Check for keystore
echo -e "${YELLOW}Step 6: Checking signing keystore...${NC}"
KEYSTORE_FILE="glam-guide.keystore"

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo -e "${YELLOW}⚠️ Keystore not found. Creating one...${NC}"
    echo "Enter keystore password (remember this!):"
    keytool -genkey -v \
        -keystore "$KEYSTORE_FILE" \
        -alias glamguide \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -dname "CN=Glam Guide AI, O=Glam Guide, C=US"
    echo -e "${GREEN}✓ Keystore created: $KEYSTORE_FILE${NC}"
else
    echo -e "${GREEN}✓ Keystore exists: $KEYSTORE_FILE${NC}"
fi

# Step 7: Build debug APK
echo -e "${YELLOW}Step 7: Building debug APK...${NC}"
cd android
./gradlew assembleDebug

echo -e "${GREEN}✓ Debug APK built!${NC}"
echo ""
echo -e "${GREEN}📱 Debug APK location:${NC}"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
echo ""

# Step 8: Build release APK (requires keystore password)
echo -e "${YELLOW}Step 8: Building release APK...${NC}"
echo "This will create a signed release APK for distribution."
echo ""

# Create local.properties with keystore info
cd ..
cat > android/local.properties << EOF
sdk.dir=/opt/local/share/android-sdk
EOF

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 BUILD COMPLETE!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📦 To install on your device:"
echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📦 To build release (signed):"
echo "   cd android && ./gradlew assembleRelease"
echo ""
echo "💡 Next steps:"
echo "   1. Test APK on Android device"
echo "   2. Share APK with friends (sideloading)"
echo "   3. When ready, pay \$25 for Play Console"
echo "   4. Upload to Google Play!"
echo ""
