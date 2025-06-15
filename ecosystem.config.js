// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'match-now-api',
      script: 'dist/main.js',
      cwd: '/usr/src/app',
      instances: 1, // 클러스터 모드: 'max' 또는 숫자
      exec_mode: 'fork', // 'cluster' 또는 'fork'
      
      // 환경변수
      env: {
        NODE_ENV: 'development',
        PORT: 3701,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3701,
      },
      
      // 로그 설정
      log_file: '/usr/src/app/logs/combined.log',
      out_file: '/usr/src/app/logs/out.log',
      error_file: '/usr/src/app/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 재시작 설정
      watch: false, // 개발환경에서는 true, 운영환경에서는 false
      ignore_watch: ['node_modules', 'logs', '*.log'],
      watch_options: {
        followSymlinks: false,
      },
      
      // 자동 재시작 설정
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 메모리 관리
      max_memory_restart: '1G',
      
      // 기타 설정
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
      
      // 헬스체크
      health_check_grace_period: 3000,
    },
  ],
};