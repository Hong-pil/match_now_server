#!/bin/bash
# pm2-commands.sh - PM2 관리 스크립트

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로고 출력
echo -e "${BLUE}"
echo "======================================"
echo "🚀 Match Now API - PM2 관리 도구"
echo "======================================"
echo -e "${NC}"

# 함수들
pm2_start() {
    echo -e "${GREEN}📦 PM2로 애플리케이션 시작...${NC}"
    docker-compose -f docker-compose.pm2.yml up --build -d
    echo -e "${GREEN}✅ 시작 완료!${NC}"
    pm2_status
}

pm2_stop() {
    echo -e "${YELLOW}⏹️  애플리케이션 중지...${NC}"
    docker-compose -f docker-compose.pm2.yml down
    echo -e "${YELLOW}✅ 중지 완료!${NC}"
}

pm2_restart() {
    echo -e "${BLUE}🔄 애플리케이션 재시작...${NC}"
    docker-compose -f docker-compose.pm2.yml restart match_now_server
    echo -e "${BLUE}✅ 재시작 완료!${NC}"
    pm2_status
}

pm2_status() {
    echo -e "${BLUE}📊 PM2 상태 확인:${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 status
}

pm2_logs() {
    echo -e "${GREEN}📋 PM2 로그 확인:${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 logs match-now-api --lines 50
}

pm2_logs_error() {
    echo -e "${RED}🚨 에러 로그 확인:${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 logs match-now-api --err --lines 30
}

pm2_monitor() {
    echo -e "${GREEN}📈 PM2 모니터링:${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 monit
}

pm2_reload() {
    echo -e "${BLUE}🔄 무중단 재로드...${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 reload match-now-api
    echo -e "${BLUE}✅ 재로드 완료!${NC}"
}

pm2_info() {
    echo -e "${BLUE}ℹ️  애플리케이션 정보:${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 describe match-now-api
}

pm2_flush() {
    echo -e "${YELLOW}🗑️  로그 삭제...${NC}"
    docker-compose -f docker-compose.pm2.yml exec match_now_server pm2 flush
    echo -e "${YELLOW}✅ 로그 삭제 완료!${NC}"
}

# 메뉴 출력
show_menu() {
    echo ""
    echo -e "${BLUE}사용 가능한 명령어:${NC}"
    echo "1) start    - 애플리케이션 시작"
    echo "2) stop     - 애플리케이션 중지"
    echo "3) restart  - 애플리케이션 재시작"
    echo "4) status   - PM2 상태 확인"
    echo "5) logs     - 로그 확인"
    echo "6) errors   - 에러 로그 확인"
    echo "7) monitor  - 실시간 모니터링"
    echo "8) reload   - 무중단 재로드"
    echo "9) info     - 애플리케이션 정보"
    echo "10) flush   - 로그 삭제"
    echo "11) help    - 도움말"
    echo "12) exit    - 종료"
    echo ""
}

# 메인 로직
case "$1" in
    start)
        pm2_start
        ;;
    stop)
        pm2_stop
        ;;
    restart)
        pm2_restart
        ;;
    status)
        pm2_status
        ;;
    logs)
        pm2_logs
        ;;
    errors)
        pm2_logs_error
        ;;
    monitor)
        pm2_monitor
        ;;
    reload)
        pm2_reload
        ;;
    info)
        pm2_info
        ;;
    flush)
        pm2_flush
        ;;
    help|"")
        show_menu
        ;;
    *)
        echo -e "${RED}❌ 알 수 없는 명령어: $1${NC}"
        show_menu
        ;;
esac

echo ""
echo -e "${GREEN}🔗 주요 URL:${NC}"
echo "📖 Swagger: http://localhost:3701/api/docs"
echo "🏠 메인: http://localhost:3701/"
echo "💊 헬스체크: http://localhost:3701/health"
echo "👥 사용자 API: http://localhost:3701/users"