// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: '사용자명 (고유값)',
    example: 'john_doe_updated',
  })
  username?: string;

  @ApiPropertyOptional({
    description: '이메일 주소 (고유값)',
    example: 'john.updated@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: '나이',
    example: 26,
  })
  age?: number;

  @ApiPropertyOptional({
    description: '자기소개',
    example: '업데이트된 자기소개입니다.',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: '관심사 목록',
    example: ['개발', '음악', '독서'],
  })
  interests?: string[];

  @ApiPropertyOptional({
    description: '활성 상태',
    example: false,
  })
  isActive?: boolean;
}