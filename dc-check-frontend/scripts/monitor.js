import { exec } from 'child_process';
import fs from 'fs';

// Create logs directory if it doesn't exist
if (!fs.existsSync('./logs')) {
  fs.mkdirSync('./logs');
}

// Create log streams
const outLog = fs.createWriteStream('./logs/out.log', { flags: 'a' });
const errorLog = fs.createWriteStream('./logs/error.log', { flags: 'a' });

function logWithTimestamp(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  if (isError) {
    errorLog.write(logMessage);
    console.error(logMessage);
  } else {
    outLog.write(logMessage);
    console.log(logMessage);
  }
}

// Monitor system resources
setInterval(() => {
  exec('tasklist | findstr "node"', (error, stdout, stderr) => {
    if (error) {
      logWithTimestamp(`Error checking processes: ${error}`, true);
      return;
    }
    if (stderr) {
      logWithTimestamp(`Process check stderr: ${stderr}`, true);
      return;
    }
    logWithTimestamp(`Active Node processes:\n${stdout}`);
  });
}, 30000); // Check every 30 seconds

// Log startup
logWithTimestamp('Monitoring service started');

// Handle process termination
process.on('SIGINT', () => {
  logWithTimestamp('Monitoring service stopped');
  outLog.end();
  errorLog.end();
  process.exit();
}); 