#!/bin/bash

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root"
    exit 1
fi

# Create necessary directories
mkdir -p /root/scripts/logs

# Copy scripts to server
cp priceUpdate.js /root/scripts/
cp cronPriceUpdate.sh /root/scripts/

# Set permissions
chmod +x /root/scripts/cronPriceUpdate.sh

# Install Node.js dependencies
cd /root/scripts
npm init -y
npm install axios csv-parser

# Create .env file if it doesn't exist
if [ ! -f /root/scripts/.env ]; then
    echo "ADMIN_TOKEN=your_admin_token_here" > /root/scripts/.env
    chmod 600 /root/scripts/.env
    echo "Please update the ADMIN_TOKEN in /root/scripts/.env"
fi

# Add cron job to run daily at 1 AM
(crontab -l 2>/dev/null | grep -v "cronPriceUpdate.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 1 * * * /root/scripts/cronPriceUpdate.sh") | crontab -

echo "Deployment completed successfully!"
echo "Please update the ADMIN_TOKEN in /root/scripts/.env"
echo "Cron job has been set to run daily at 1 AM" 