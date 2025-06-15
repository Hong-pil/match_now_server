// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, // createdAt, updatedAt 자동 생성
  versionKey: false, // __v 필드 제거
})
export class User {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: '사용자명 (고유값)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
  })
  @Prop({ 
    required: true, 
    unique: true, 
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  username: string;

  @ApiProperty({
    description: '이메일 주소 (고유값)',
    example: 'john@example.com',
    format: 'email',
  })
  @Prop({ 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true,
  })
  email: string;

  @ApiProperty({
    description: '나이',
    example: 25,
    minimum: 18,
    maximum: 100,
  })
  @Prop({ 
    required: true,
    min: 18,
    max: 100,
  })
  age: number;

  @ApiPropertyOptional({
    description: '자기소개',
    example: '안녕하세요! 개발자입니다.',
    maxLength: 500,
  })
  @Prop({ 
    trim: true,
    maxlength: 500,
  })
  bio?: string;

  @ApiPropertyOptional({
    description: '관심사 목록',
    example: ['개발', '음악', '영화'],
    type: [String],
  })
  @Prop({ 
    type: [String], 
    default: [],
  })
  interests?: string[];

  @ApiProperty({
    description: '활성 상태',
    example: true,
    default: true,
  })
  @Prop({ 
    default: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: '위치 정보',
    example: {
      lat: 37.5665,
      lng: 126.9780,
    },
  })
  @Prop({
    type: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    required: false,
  })
  location?: {
    lat: number;
    lng: number;
  };

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-15T09:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-15T09:30:00.000Z',
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);