// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ 
    summary: '새 사용자 생성',
    description: '새로운 사용자를 생성합니다. 사용자명과 이메일은 고유해야 합니다.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '사용자가 성공적으로 생성됨',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 사용자명 또는 이메일',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: '모든 사용자 조회',
    description: '등록된 모든 사용자 목록을 조회합니다.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'john' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, example: true })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 목록 조회 성공',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    const options = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      isActive: isActive ? isActive === 'true' : undefined,
    };
    
    return this.usersService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: '특정 사용자 조회',
    description: 'ID로 특정 사용자의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '사용자 MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 조회 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '사용자를 찾을 수 없음',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: '사용자 정보 수정',
    description: 'ID로 특정 사용자의 정보를 부분적으로 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '사용자 MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 정보 수정 성공',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '사용자를 찾을 수 없음',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: '사용자 삭제',
    description: 'ID로 특정 사용자를 완전히 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '사용자 MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 삭제 성공',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/matches')
  @ApiOperation({ 
    summary: '사용자 매칭 목록',
    description: '특정 사용자와 매칭된 다른 사용자들의 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '사용자 MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '매칭 목록 조회 성공',
  })
  getUserMatches(@Param('id') id: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.usersService.getUserMatches(id, limitNum);
  }
}