module.exports = {
  apps: [
    {
      name: 'fur4-playwright-tests',
      script: 'npm',
      args: 'run test:teams:full',
      cwd: '/app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        SEND_TEAMS: 'true'
      },
      cron_restart: '*/15 * * * *', // Restart every 15 minutes (runs the test)
      log_file: '/app/logs/combined.log',
      out_file: '/app/logs/out.log',
      error_file: '/app/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
}; 