/**
 * 설치된 packages
 * - npm install @nestjs/config
 * 
 * # mapped-types 패키지 설치
 * - npm install @nestjs/mapped-types
 * # Mongoose (MongoDB ODM) 설치
 * - npm install @nestjs/mongoose mongoose
 * # 검증 라이브러리 설치
 * - npm install class-validator class-transformer
 * # 타입 정의 설치
 * - npm install -D @types/mongoose
 * 
 * # NestJS Swagger 관련 패키지 설치
 * - npm install --save @nestjs/swagger swagger-ui-express
 * # 타입 정의 (개발용)
 * - npm install --save-dev @types/swagger-ui-express
 * 
 * # PM2 글로벌 설치 (호스트에서)
 * - npm install -g pm2
 * # 프로젝트에 PM2 의존성 추가
 * - npm install --save-dev pm2
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    // 글로벌 검증 파이프 설정
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // CORS 설정
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3701'],
      credentials: true,
    });

    // Swagger 설정
    const config = new DocumentBuilder()
      .setTitle('Match Now API')
      .setDescription('매칭 서비스 API 문서')
      .setVersion('1.0')
      .addTag('users', '사용자 관리')
      .addTag('auth', '인증')
      .addTag('matches', '매칭')
      .addBearerAuth() // JWT 토큰 인증 지원
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // 새로고침 시 토큰 유지
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    // 글로벌 에러 핸들러
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('🚨 Uncaught Exception:', error);
      process.exit(1);
    });

    const port = process.env.PORT || 3701;
    await app.listen(port);
    
    logger.log(`🚀 서버가 시작되었습니다: http://localhost:${port}`);
    logger.log(`🌍 환경: ${process.env.NODE_ENV}`);
    logger.log(`🗃️  MongoDB: ${process.env.MONGODB_URI}`);
    logger.log(`📊 API 테스트: http://localhost:${port}/users`);
    logger.log(`📖 Swagger 문서: http://localhost:${port}/api/docs`);
    logger.log(`🔍 API JSON: http://localhost:${port}/api/docs-json`);

  } catch (error) {
    logger.error('🚨 서버 시작 실패:', error);
    process.exit(1);
  }
}

bootstrap();