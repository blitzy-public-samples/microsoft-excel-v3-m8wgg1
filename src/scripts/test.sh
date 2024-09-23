#!/bin/bash

set -e

# Function to print colored output
print_colored() {
    echo -e "\033[1;34m$1\033[0m"
}

# Function to handle errors
handle_error() {
    print_colored "Error occurred in $1"
    exit 1
}

# Function to run tests with error handling
run_test() {
    $1 || handle_error "$2"
}

# Run web tests
test_web() {
    print_colored "Running web tests..."
    cd src/web/client
    npm install
    npm run test
    cd ../../..
}

# Run desktop tests (Windows and macOS)
test_desktop() {
    print_colored "Running desktop tests..."
    
    # Run Windows tests
    print_colored "Testing Windows version..."
    cd src/desktop/windows
    dotnet test
    cd ../../..
    
    # Run macOS tests
    print_colored "Testing macOS version..."
    cd src/desktop/macos
    xcodebuild test -project ExcelApp.xcodeproj -scheme ExcelApp -destination 'platform=macOS'
    cd ../../..
}

# Run mobile tests (iOS and Android)
test_mobile() {
    print_colored "Running mobile tests..."
    
    # Run iOS tests
    print_colored "Testing iOS version..."
    cd src/mobile/ios
    xcodebuild test -project ExcelApp.xcodeproj -scheme ExcelApp -destination 'platform=iOS Simulator,name=iPhone 12'
    cd ../../..
    
    # Run Android tests
    print_colored "Testing Android version..."
    cd src/mobile/android
    ./gradlew test
    cd ../../..
}

# Run API tests
test_api() {
    print_colored "Running API tests..."
    cd src/api
    npm install
    npm run test
    cd ../..
}

# Main test process
main() {
    print_colored "Starting test process for Microsoft Excel..."
    
    # Parse command-line arguments
    while [[ $# -gt 0 ]]
    do
        key="$1"
        case $key in
            --web)
            run_test test_web "Web tests"
            shift
            ;;
            --desktop)
            run_test test_desktop "Desktop tests"
            shift
            ;;
            --mobile)
            run_test test_mobile "Mobile tests"
            shift
            ;;
            --api)
            run_test test_api "API tests"
            shift
            ;;
            *)
            print_colored "Unknown option: $key"
            exit 1
            ;;
        esac
    done

    # If no arguments provided, run all tests
    if [ $# -eq 0 ]; then
        run_test test_web "Web tests"
        run_test test_desktop "Desktop tests"
        run_test test_mobile "Mobile tests"
        run_test test_api "API tests"
    fi
    
    print_colored "All tests completed successfully."
}

# Run the main function with command-line arguments
main "$@"