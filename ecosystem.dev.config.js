// ecosystem.dev.config.js
module.exports = {
  apps: [
    {
      name: 'match-now-api',
      script: 'dist/main.js',
      cwd: '/usr/src/app',
      instances: 1,
      exec_mode: 'fork',
      
      // 개발환경 설정
      env: {
        NODE_ENV: 'development',
        PORT: 3701,
        DEBUG: 'true',
        LOG_LEVEL: 'debug',
      },
      
      // 로그 설정
      log_file: '/usr/src/app/logs/combined.log',
      out_file: '/usr/src/app/logs/out.log',
      error_file: '/usr/src/app/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // 개발용 재시작 설정
      watch: true, // 파일 변경 감지
      ignore_watch: [
        'node_modules',
        'logs',
        '*.log',
        '.git',
        'coverage',
        'dist',
      ],
      watch_options: {
        followSymlinks: false,
        usePolling: true, // Docker에서 권장
        interval: 1000,
      },
      
      // 자동 재시작
      restart_delay: 1000,
      max_restarts: 50, // 개발용으로 많이 설정
      min_uptime: '5s',
      
      // 메모리 관리
      max_memory_restart: '500M',
      
      // 빠른 재시작
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 5000,
      
      // 개발용 추가 설정
      autorestart: true,
      combine_logs: true,
      
      // 소스맵 지원
      source_map_support: true,
      
      // 개발용 환경변수
      env_development: {
        NODE_ENV: 'development',
        DEBUG: '*',
        CHOKIDAR_USEPOLLING: 'true',
      },
    },
  ],
};