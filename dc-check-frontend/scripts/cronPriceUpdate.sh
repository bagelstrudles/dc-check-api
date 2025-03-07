#!/bin/bash

# Load environment variables
if [ -f /root/scripts/.env ]; then
    export $(cat /root/scripts/.env | grep -v '#' | awk '/=/ {print $1}')
fi

# Set working directory
cd /root/scripts

# Log file paths
LOG_FILE="/var/log/price-updates.log"
ERROR_LOG="/var/log/price-updates-error.log"

# Ensure log files exist
touch $LOG_FILE
touch $ERROR_LOG

# Function to send error notifications
notify_error() {
    echo "[$(date)] ERROR: $1" >> $ERROR_LOG
    # Add notification logic here (e.g., email, Slack, etc.)
}

# Verify environment variables
if [ -z "$ADMIN_TOKEN" ]; then
    notify_error "ADMIN_TOKEN is not set"
    exit 1
fi

# Start the price update process
echo "[$(date)] Starting price update process" >> $LOG_FILE

# Run the Node.js script
/usr/bin/node priceUpdate.js >> $LOG_FILE 2>> $ERROR_LOG

# Check if the script executed successfully
if [ $? -ne 0 ]; then
    notify_error "Price update script failed. Check $ERROR_LOG for details."
    exit 1
fi

# Rotate logs if they get too large (keep last 7 days)
find /var/log -name "price-updates*.log" -mtime +7 -delete

echo "[$(date)] Price update process completed" >> $LOG_FILE 