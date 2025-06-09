/**
 * 설치된 packages
 * - npm install @nestjs/config
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3701);
}
bootstrap();
