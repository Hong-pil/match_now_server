#!/bin/bash
# deploy.sh - Oracle Cloud 배포 스크립트

echo "🚀 Match Now API 배포 시작..."

# Git에서 최신 코드 받기
echo "📦 최신 코드 가져오는 중..."
git pull origin main

# 기존 컨테이너 중지 및 제거
echo "⏹️ 기존 컨테이너 중지 중..."
docker-compose -f docker-compose.oracle.yml down 2>/dev/null || true

# 이미지 재빌드 및 시작
echo "🔨 Docker 이미지 빌드 및 시작..."
docker-compose -f docker-compose.oracle.yml up --build -d

# 상태 확인
echo "📊 배포 상태 확인..."
sleep 15
docker-compose -f docker-compose.oracle.yml ps

# 헬스체크
echo "💊 헬스체크 확인..."
for i in {1..30}; do
    if curl -f http://localhost:3701/health >/dev/null 2>&1; then
        echo "✅ 서비스가 정상적으로 시작되었습니다!"
        break
    fi
    echo "대기 중... ($i/30)"
    sleep 2
done

# Public IP 가져오기
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "YOUR_SERVER_IP")

echo ""
echo "🎉 배포 완료!"
echo "=============================="
echo "🔗 접속 URL들:"
echo "   메인: http://${PUBLIC_IP}:3701"
echo "   Swagger: http://${PUBLIC_IP}:3701/api/docs"
echo "   헬스체크: http://${PUBLIC_IP}:3701/health"
echo "   사용자 API: http://${PUBLIC_IP}:3701/users"

# 로그 확인
echo ""
echo "📋 최근 로그 (마지막 10줄):"
docker-compose -f docker-compose.oracle.yml logs app --tail=10