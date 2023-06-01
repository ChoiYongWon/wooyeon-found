import { CATEGORY } from '@app/common/enums/category.enum';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class RequestReadNearPostDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsIn([0.01, 0.05, 0.1])
  range: number;

  @ApiProperty()
  @IsEnum(CATEGORY, { each: true })
  @IsArray()
  category: CATEGORY[];
}
