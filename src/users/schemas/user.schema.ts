import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true, // createdAt, updatedAt 자동 생성
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 20 })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, min: 18, max: 100 })
  age: number;

  @Prop({ maxlength: 500 })
  bio?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: false,
  })
  location?: {
    lat: number;
    lng: number;
  };

  // 가상 필드 - ObjectId를 문자열로 변환
  id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 가상 필드 설정 (타입 명시적 지정)
UserSchema.virtual('id').get(function (this: UserDocument) {
  return (this._id as Types.ObjectId).toHexString();
});

// JSON으로 변환할 때 설정
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// 인덱스 설정
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'location.lat': 1, 'location.lng': 1 });