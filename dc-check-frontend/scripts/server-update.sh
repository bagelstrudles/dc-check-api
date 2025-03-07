#!/bin/bash

# Update repository
cd /root/dc-check-api
git pull origin main

# Update frontend dependencies
cd dc-check-frontend
npm install

# Set up scripts directory
mkdir -p /root/scripts
mkdir -p /var/log

# Copy and set up scripts
cp scripts/priceUpdate.js /root/scripts/
cp scripts/cronPriceUpdate.sh /root/scripts/
chmod +x /root/scripts/cronPriceUpdate.sh

# Install script dependencies
cd /root/scripts
npm install axios csv-parser

# Set up cron job if not exists
if ! crontab -l | grep -q "cronPriceUpdate.sh"; then
    (crontab -l 2>/dev/null; echo "0 0 * * * /root/scripts/cronPriceUpdate.sh") | crontab -
fi

# Create log files if they don't exist
touch /var/log/price-updates.log
touch /var/log/price-updates-error.log

# Set proper permissions
chmod 644 /var/log/price-updates*.log

echo "Server update completed successfully!"
echo "Don't forget to update ADMIN_TOKEN in /root/scripts/cronPriceUpdate.sh" 