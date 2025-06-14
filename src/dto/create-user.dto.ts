import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, MinLength, MaxLength, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}