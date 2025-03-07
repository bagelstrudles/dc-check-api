#!/bin/bash

# Set environment variables
export NODE_ENV=production
export ADMIN_TOKEN="your_admin_token_here"  # Replace with actual admin token
export VITE_API_URL="http://64.23.235.7:3000/api"

# Set working directory
cd /root/scripts

# Log file paths
LOG_FILE="/var/log/price-updates.log"
ERROR_LOG="/var/log/price-updates-error.log"

# Ensure log files exist
touch $LOG_FILE
touch $ERROR_LOG

# Function to send error notifications (you can modify this to use email or other notification methods)
notify_error() {
    echo "[$(date)] ERROR: $1" >> $ERROR_LOG
    # Add notification logic here (e.g., email, Slack, etc.)
}

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