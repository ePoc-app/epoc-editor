#!/bin/bash

# Configuration
KEYCHAIN_NAME="temp.keychain"
KEYCHAIN_PASSWORD="temp_password"

# Delete existing keychain if it exists
security delete-keychain "$KEYCHAIN_NAME" || true

# Create and unlock a temporary keychain
security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"
security default-keychain -s "$KEYCHAIN_NAME"
security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"

# Debug: List keychains
security list-keychains -s "$KEYCHAIN_NAME"
security list-keychains
security find-identity

# Download and import Apple intermediate certificates
curl -o AppleWWDRMPCA1G1.cer https://www.apple.com/certificateauthority/AppleWWDRMPCA1G1.cer
curl -o DeveloperIDCA.cer https://www.apple.com/certificateauthority/DeveloperIDCA.cer
curl -o DeveloperIDG2CA.cer https://www.apple.com/certificateauthority/DeveloperIDG2CA.cer
security import AppleWWDRMPCA1G1.cer -k "$KEYCHAIN_NAME" -T /usr/bin/codesign -A
security import DeveloperIDCA.cer -k "$KEYCHAIN_NAME" -T /usr/bin/codesign -A
security import DeveloperIDG2CA.cer -k "$KEYCHAIN_NAME" -T /usr/bin/codesign -A

# Debug CERT Variables
echo "$MACOS_CERT_P12" "$MACOS_CERT_PASSWORD"

# Decode and import Developer ID certificate
echo "$MACOS_CERT_P12" | base64 --decode > developer_id.p12
security import developer_id.p12 -P "$MACOS_CERT_PASSWORD" -k "$KEYCHAIN_NAME" -T /usr/bin/codesign -A

# Allow codesign to access the keychain
security set-key-partition-list -S apple-tool:,apple: -s -k "$KEYCHAIN_PASSWORD" "$KEYCHAIN_NAME"

# Debug: List identities
security find-identity

# Debug: List valid identities
security find-identity -v -p codesigning "$KEYCHAIN_NAME"
