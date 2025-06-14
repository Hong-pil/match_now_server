// docker-init/mongo-init-auth.js
print('🔧 MongoDB 초기화 시작 (인증 포함)...');

// match_now_db 데이터베이스로 전환
db = db.getSiblingDB('match_now_db');

print('📁 데이터베이스:', db.getName());

try {
  // 1. 데이터베이스 사용자 생성
  db.createUser({
    user: 'matchuser',
    pwd: 'matchpass123',
    roles: [
      {
        role: 'readWrite',
        db: 'match_now_db'
      }
    ]
  });
  
  print('✅ 사용자 생성 완료: matchuser');

  // 2. 샘플 데이터 삽입
  const sampleUsers = [
    {
      username: 'john_doe',
      email: 'john@example.com',
      age: 25,
      bio: 'NestJS 개발자입니다.',
      isActive: true,
      interests: ['개발', '음악', '영화'],
      location: {
        lat: 37.5665,
        lng: 126.9780
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      age: 30,
      bio: 'UI/UX 디자이너입니다.',
      isActive: true,
      interests: ['디자인', '여행', '요리'],
      location: {
        lat: 37.5172,
        lng: 127.0473
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'mike_wilson',
      email: 'mike@example.com',
      age: 28,
      bio: '풀스택 개발자입니다.',
      isActive: true,
      interests: ['프로그래밍', '게임', '독서'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const result = db.users.insertMany(sampleUsers);
  print('✅ 샘플 사용자 데이터 삽입 완료:', result.insertedIds.length, '개');

  // 3. 인덱스 생성
  db.users.createIndex({ "email": 1 }, { unique: true });
  db.users.createIndex({ "username": 1 }, { unique: true });
  db.users.createIndex({ "location.lat": 1, "location.lng": 1 });
  
  print('🔍 인덱스 생성 완료');

  // 4. 결과 확인 (단순화된 방식)
  const userCount = db.users.find().count();
  print('📊 총 사용자 수:', userCount);
  
  // 간단한 테스트 쿼리
  const firstUser = db.users.findOne();
  if (firstUser) {
    print('👤 첫 번째 사용자:', firstUser.username);
  }

  print('🎉 MongoDB 초기화 완료!');
  print('👤 사용자: matchuser');
  print('🔑 비밀번호: matchpass123');
  print('🔗 연결 URI: mongodb://matchuser:matchpass123@localhost:27017/match_now_db?authSource=match_now_db');

} catch (error) {
  print('❌ 초기화 중 오류 발생:', error);
  
  // 사용자가 이미 존재하는 경우 처리
  if (error.code === 11000 || error.codeName === 'DuplicateKey') {
    print('ℹ️ 사용자가 이미 존재합니다. 계속 진행...');
    
    // 기존 데이터 확인
    try {
      const existingCount = db.users.find().count();
      print('📊 기존 사용자 수:', existingCount);
      
      if (existingCount === 0) {
        print('🔄 샘플 데이터 재삽입 시도...');
        const retryResult = db.users.insertMany(sampleUsers);
        print('✅ 재삽입 완료:', retryResult.insertedIds.length, '개');
      }
    } catch (retryError) {
      print('⚠️ 재시도 중 오류:', retryError.message);
    }
  } else {
    print('💥 심각한 오류:', error.message);
  }
}