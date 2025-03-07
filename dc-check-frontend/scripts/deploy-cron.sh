#!/bin/bash

# Remote server details
SERVER="root@64.23.235.7"
REMOTE_SCRIPTS_DIR="/root/scripts"
REMOTE_LOG_DIR="/var/log"

# Create remote directories
ssh $SERVER "mkdir -p $REMOTE_SCRIPTS_DIR $REMOTE_LOG_DIR"

# Copy scripts to server
scp priceUpdate.js $SERVER:$REMOTE_SCRIPTS_DIR/
scp cronPriceUpdate.sh $SERVER:$REMOTE_SCRIPTS_DIR/

# Set up permissions
ssh $SERVER "chmod +x $REMOTE_SCRIPTS_DIR/cronPriceUpdate.sh"

# Install required Node.js packages on server
ssh $SERVER "cd $REMOTE_SCRIPTS_DIR && npm install axios csv-parser"

# Set up cron job
CRON_JOB="0 0 * * * $REMOTE_SCRIPTS_DIR/cronPriceUpdate.sh"
ssh $SERVER "crontab -l 2>/dev/null | grep -v 'cronPriceUpdate.sh' | { cat; echo \"$CRON_JOB\"; } | crontab -"

echo "Cron job deployment completed!" 