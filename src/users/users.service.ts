import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      if (error.code === 11000) {
        // 중복 키 에러
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`${field}이(가) 이미 존재합니다.`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments({ isActive: true }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      
      if (!updatedUser) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      
      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`${field}이(가) 이미 존재합니다.`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    // 소프트 삭제 (isActive를 false로 설정)
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }

  async hardRemove(id: string): Promise<void> {
    // 하드 삭제 (실제 문서 삭제)
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }

  // 위치 기반 사용자 검색
  async findNearbyUsers(lat: number, lng: number, maxDistance = 10000): Promise<User[]> {
    return await this.userModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: maxDistance, // 미터 단위
          },
        },
        isActive: true,
      })
      .limit(50)
      .exec();
  }

  // 검색 기능
  async search(query: string): Promise<User[]> {
    return await this.userModel
      .find({
        $and: [
          { isActive: true },
          {
            $or: [
              { username: { $regex: query, $options: 'i' } },
              { bio: { $regex: query, $options: 'i' } },
              { interests: { $in: [new RegExp(query, 'i')] } },
            ],
          },
        ],
      })
      .limit(20)
      .exec();
  }

  // 통계 정보
  async getStats() {
    const stats = await this.userModel.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
          },
          averageAge: { $avg: '$age' },
        },
      },
    ]);

    return stats[0] || { totalUsers: 0, activeUsers: 0, averageAge: 0 };
  }
}