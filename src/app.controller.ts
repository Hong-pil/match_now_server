// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: '서버 상태 확인',
    description: '서버가 정상적으로 동작하는지 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서버 정상 동작',
    schema: {
      example: {
        message: 'Match Now API Server is running!',
        version: '1.0.0',
        timestamp: '2024-01-15T09:30:00.000Z',
        environment: 'development',
      },
    },
  })
  getHello() {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ 
    summary: '헬스체크',
    description: '서버와 데이터베이스 연결 상태를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '헬스체크 성공',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-15T09:30:00.000Z',
        uptime: 1234.567,
        database: 'connected',
        memory: {
          used: '45.2 MB',
          total: '128 MB',
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: '서비스 이용 불가 (데이터베이스 연결 실패 등)',
    schema: {
      example: {
        status: 'error',
        timestamp: '2024-01-15T09:30:00.000Z',
        database: 'disconnected',
        error: 'Database connection failed',
      },
    },
  })
  getHealthCheck() {
    return this.appService.getHealthCheck();
  }
}