import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 전역으로 사용하기 위해 isGlobal: true 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // 기본값이지만 명시적으로 설정
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}