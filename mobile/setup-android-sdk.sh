#!/bin/bash

# Setup Android SDK for MacPorts systems
# Downloads command line tools (no Android Studio needed)

set -e

echo "📱 Setting up Android SDK..."
echo "==========================="

# Create SDK directory
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk

# Download command line tools
if [ ! -d "cmdline-tools" ]; then
    echo "Downloading Android SDK command line tools..."
    curl -O https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip
    
    echo "Extracting..."
    unzip -q commandlinetools-mac-11076708_latest.zip
    rm commandlinetools-mac-11076708_latest.zip
    
    # Move to correct structure
    mkdir -p cmdline-tools/latest
    mv cmdline-tools/bin cmdline-tools/latest/
    mv cmdline-tools/lib cmdline-tools/latest/
    
    echo "✓ Command line tools installed"
fi

# Set environment variables
echo ""
echo "Add these to your ~/.zshrc:"
echo ""
echo "export ANDROID_HOME=\$HOME/Android/Sdk"
echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin"
echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
echo ""

# Export for current session
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Accept licenses
echo "Accepting Android SDK licenses..."
yes | sdkmanager --licenses || true

# Install required packages
echo "Installing required SDK packages..."
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
sdkmanager "platform-tools"

echo ""
echo "✅ Android SDK setup complete!"
echo ""
echo "📋 Summary:"
echo "   ANDROID_HOME: $ANDROID_HOME"
echo "   Build tools: 34.0.0"
echo "   Platform: Android 14 (API 34)"
echo ""
echo "🚀 You can now build Android apps!"
