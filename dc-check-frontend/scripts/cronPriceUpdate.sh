#!/bin/bash

# Load environment variables
if [ -f /root/scripts/.env ]; then
    source /root/scripts/.env
fi

# Set working directory
cd /root/scripts

# Define log file
LOG_FILE="/root/scripts/logs/price_update_$(date +%Y%m%d).log"
ERROR_LOG="/root/scripts/logs/price_update_error_$(date +%Y%m%d).log"

# Create logs directory if it doesn't exist
mkdir -p /root/scripts/logs

# Function to send error notification
send_error_notification() {
    local error_message="$1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $error_message" >> "$ERROR_LOG"
    # You can add email notification or other notification methods here
}

# Check if ADMIN_TOKEN is set
if [ -z "$ADMIN_TOKEN" ]; then
    send_error_notification "ADMIN_TOKEN environment variable is not set"
    exit 1
fi

# Run the price update script
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting price update..." >> "$LOG_FILE"
node priceUpdate.js >> "$LOG_FILE" 2>> "$ERROR_LOG"

# Check if the update was successful
if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Price update completed successfully" >> "$LOG_FILE"
else
    send_error_notification "Price update failed. Check error log for details."
fi

# Rotate logs older than 7 days
find /root/scripts/logs -name "price_update_*.log" -mtime +7 -delete
find /root/scripts/logs -name "price_update_error_*.log" -mtime +7 -delete
