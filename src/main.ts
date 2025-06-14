/**
 * 설치된 packages
 * - npm install @nestjs/config
 * # mapped-types 패키지 설치
 * - npm install @nestjs/mapped-types
 * # Mongoose (MongoDB ODM) 설치
 * - npm install @nestjs/mongoose mongoose
 * # 검증 라이브러리 설치
 * - npm install class-validator class-transformer
 * # 타입 정의 설치
 * - npm install -D @types/mongoose
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 글로벌 검증 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성 있으면 에러
      transform: true, // 자동 타입 변환
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS 설정 (필요시)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3701'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3701);
  console.log(`🚀 Server is running on: http://localhost:${process.env.PORT ?? 3701}`);
  console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI}`);
}
bootstrap();