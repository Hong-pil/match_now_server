// src/users/dto/user-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '사용자 고유 ID',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: '사용자명',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: '이메일 주소',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: '나이',
    example: 25,
  })
  age: number;

  @ApiPropertyOptional({
    description: '자기소개',
    example: '안녕하세요! 개발자입니다.',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: '관심사 목록',
    example: ['개발', '음악', '영화'],
  })
  interests?: string[];

  @ApiProperty({
    description: '활성 상태',
    example: true,
  })
  isActive: boolean;

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