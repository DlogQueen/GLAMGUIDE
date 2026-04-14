#!/bin/bash

# Generate QR code for APK download
# Users scan with phone camera to download

echo "📱 Glam Guide AI - QR Code Generator"
echo "======================================"

# Check if qrencode is installed
if ! command -v qrencode &> /dev/null; then
    echo "Installing qrencode via MacPorts..."
    sudo port install qrencode
fi

# Default to local IP for testing
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found. Build first:"
    echo "   ./mobile/build-android.sh"
    exit 1
fi

# Create download directory
mkdir -p dist/apk
cp "$APK_PATH" dist/apk/glam-guide-ai.apk

# Options for sharing
echo ""
echo "Choose sharing method:"
echo "1. Local network (same WiFi) - FASTEST"
echo "2. Upload to file hosting (Google Drive, Dropbox)"
echo "3. I already have a download URL"
echo ""
read -p "Option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📡 Starting local server..."
        echo "   URL: http://$LOCAL_IP:8080/glam-guide-ai.apk"
        echo ""
        
        # Generate QR code
        qrencode -o dist/download-qr.png "http://$LOCAL_IP:8080/glam-guide-ai.apk"
        
        echo "✅ QR Code generated: dist/download-qr.png"
        echo ""
        echo "📲 Instructions for users:"
        echo "   1. Connect to same WiFi as you"
        echo "   2. Open camera app"
        echo "   3. Scan QR code"
        echo "   4. Tap download link"
        echo "   5. Install APK"
        echo ""
        
        # Start Python server
        cd dist && python3 -m http.server 8080
        ;;
        
    2)
        echo ""
        echo "📤 Upload dist/apk/glam-guide-ai.apk to:"
        echo "   - Google Drive (get shareable link)"
        echo "   - Dropbox"
        echo "   - WeTransfer"
        echo ""
        read -p "Paste download URL: " download_url
        
        qrencode -o dist/download-qr.png "$download_url"
        
        echo "✅ QR Code generated: dist/download-qr.png"
        echo "Share this image with anyone!"
        ;;
        
    3)
        read -p "Enter your download URL: " download_url
        qrencode -o dist/download-qr.png "$download_url"
        
        echo "✅ QR Code generated: dist/download-qr.png"
        echo "Share this image with anyone!"
        ;;
        
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done! Users can scan the QR code to download."
