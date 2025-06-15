// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsNumber, IsOptional, IsArray, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자명 (고유값)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '이메일 주소 (고유값)',
    example: 'john@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '나이',
    example: 25,
    minimum: 18,
    maximum: 100,
  })
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @ApiPropertyOptional({
    description: '자기소개',
    example: '안녕하세요! 개발자입니다.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: '관심사 목록',
    example: ['개발', '음악', '영화'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({
    description: '활성 상태',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}