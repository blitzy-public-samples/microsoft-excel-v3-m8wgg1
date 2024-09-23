#!/bin/bash

set -e

# Function to print colored output
print_colored() {
    echo -e "\033[1;34m$1\033[0m"
}

# Build web version
build_web() {
    print_colored "Building web version..."
    cd src/web/client
    npm install
    npm run build
    cd ../../..
}

# Build desktop version (Windows and macOS)
build_desktop() {
    print_colored "Building desktop version..."
    
    # Build Windows version
    print_colored "Building for Windows..."
    cd src/desktop/windows
    dotnet restore
    dotnet build --configuration Release
    cd ../../..
    
    # Build macOS version
    print_colored "Building for macOS..."
    cd src/desktop/macos
    xcodebuild -project ExcelApp.xcodeproj -scheme ExcelApp -configuration Release
    cd ../../..
}

# Build mobile version (iOS and Android)
build_mobile() {
    print_colored "Building mobile version..."
    
    # Build iOS version
    print_colored "Building for iOS..."
    cd src/mobile/ios
    xcodebuild -project ExcelApp.xcodeproj -scheme ExcelApp -configuration Release -sdk iphoneos
    cd ../../..
    
    # Build Android version
    print_colored "Building for Android..."
    cd src/mobile/android
    ./gradlew assembleRelease
    cd ../../..
}

# Main build process
main() {
    print_colored "Starting build process for Microsoft Excel..."
    
    build_web
    build_desktop
    build_mobile
    
    print_colored "Build process completed successfully."
}

# Run the main function
main