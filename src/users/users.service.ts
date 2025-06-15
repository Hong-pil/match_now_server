// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB 중복 키 에러
        const field = Object.keys(error.keyValue)[0];
        throw new ConflictException(`${field} already exists`);
      }
      throw error;
    }
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
    } = options || {};

    // 검색 조건 구성
    const query: any = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    // 총 문서 수 조회
    const total = await this.userModel.countDocuments(query);
    
    // 페이지네이션 적용하여 데이터 조회
    const skip = (page - 1) * limit;
    const data = await this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // 최신순 정렬
      .exec();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      
      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ConflictException(`${field} already exists`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
      deletedId: id,
    };
  }

  async getUserMatches(id: string, limit: number = 10): Promise<{
    user: Partial<User>;
    matches: Array<Partial<User> & { matchScore: number; commonInterests: string[] }>;
    total: number;
  }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    // 기준 사용자 조회
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 다른 활성 사용자들 조회
    const otherUsers = await this.userModel
      .find({ 
        _id: { $ne: id }, 
        isActive: true 
      })
      .exec();

    // 매칭 스코어 계산 및 정렬
    const matches = otherUsers
      .map(otherUser => {
        const userInterests = user.interests || [];
        const otherInterests = otherUser.interests || [];
        
        // 공통 관심사 찾기
        const commonInterests = userInterests.filter(interest => 
          otherInterests.includes(interest)
        );
        
        // 매칭 스코어 계산 (0~1)
        const totalInterests = new Set([...userInterests, ...otherInterests]).size;
        const matchScore = totalInterests > 0 ? commonInterests.length / totalInterests : 0;
        
        return {
          _id: otherUser._id,
          username: otherUser.username,
          age: otherUser.age,
          bio: otherUser.bio,
          interests: otherUser.interests,
          matchScore: Math.round(matchScore * 100) / 100, // 소수점 2자리
          commonInterests,
        };
      })
      .filter(match => match.matchScore > 0) // 매칭 스코어가 0보다 큰 것만
      .sort((a, b) => b.matchScore - a.matchScore) // 매칭 스코어 높은 순
      .slice(0, limit); // 제한 수만큼

    return {
      user: {
        _id: user._id,
        username: user.username,
        interests: user.interests,
      },
      matches,
      total: matches.length,
    };
  }
}