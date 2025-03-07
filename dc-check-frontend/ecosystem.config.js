module.exports = {
  apps: [{
    name: 'dc-check-frontend',
    script: 'npm',
    args: 'run dev',
    cwd: './',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 5173
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5173
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000
  }]
} 