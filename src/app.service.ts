// src/app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  getHello() {
    return {
      message: 'Match Now API Server is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      documentation: '/api/docs',
    };
  }

  getHealthCheck() {
    try {
      const memoryUsage = process.memoryUsage();
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: this.mongoConnection.readyState === 1 ? 'connected' : 'disconnected',
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        },
        mongodb: {
          host: this.mongoConnection.host,
          name: this.mongoConnection.name,
          readyState: this.mongoConnection.readyState,
          // 1: connected, 0: disconnected, 2: connecting, 3: disconnecting
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}