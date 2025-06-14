import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI', 'mongodb://mongodb:27017/match_now_db');
        
        console.log('🔌 Connecting to MongoDB:', uri);
        
        return {
          uri,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
        };
      },
      inject: [ConfigService],
    }),
    
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}