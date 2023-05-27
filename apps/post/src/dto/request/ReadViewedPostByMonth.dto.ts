import { CATEGORY } from '@app/common/enums/category.enum';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  Max,
} from 'class-validator';

export class RequestReadViewedPostByMonthDto {
  @ApiProperty()
  @IsNumberString()
  month: number;

  @ApiProperty()
  @IsNumberString()
  year: number;
}
