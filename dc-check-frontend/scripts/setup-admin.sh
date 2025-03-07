#!/bin/bash

# Check if password is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <admin_password>"
    echo "Example: $0 mySecurePassword123"
    exit 1
fi

# Set up environment
export ADMIN_PASSWORD="$1"

# Create scripts directory if it doesn't exist
mkdir -p /root/scripts

# Install dependencies
cd /root/scripts
npm init -y
npm install axios

# Copy and run the admin creation script
cp create-admin.js /root/scripts/
node create-admin.js

# Set proper permissions
chmod 600 /root/scripts/.env

echo "Setup complete! Check the output above for any errors." 