import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const port = this.configService.get<number>('PORT');
    const dbHost = this.configService.get<string>('DATABASE_HOST');
    
    return `Hello Pil! Running on port ${port}, DB: ${dbHost}`;
  }
}