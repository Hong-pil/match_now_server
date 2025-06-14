import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.usersService.findAll(page, limit);
  }

  @Get('stats')
  async getStats() {
    return await this.usersService.getStats();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      return [];
    }
    return await this.usersService.search(query);
  }

  @Get('nearby')
  async findNearbyUsers(
    @Query('lat', ParseIntPipe) lat: number,
    @Query('lng', ParseIntPipe) lng: number,
    @Query('distance', new DefaultValuePipe(10000), ParseIntPipe) distance: number,
  ) {
    return await this.usersService.findNearbyUsers(lat, lng, distance);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardRemove(@Param('id') id: string) {
    await this.usersService.hardRemove(id);
  }
}