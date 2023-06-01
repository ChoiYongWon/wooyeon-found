import { CATEGORY } from '@app/common/enums/category.enum';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsLatLong,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class RequestCreatePostDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(CATEGORY)
  category: CATEGORY;

  @ApiProperty()
  @Type(() => Number)
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsLatitude()
  latitude: number;

  @ApiProperty()
  file: Express.Multer.File[];
}
