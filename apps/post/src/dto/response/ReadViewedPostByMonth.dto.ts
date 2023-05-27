import { CATEGORY } from '@app/common/enums/category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class ResponseReadViewedPostByMonthDto {
  @ApiProperty()
  @IsString()
  post_id: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(CATEGORY)
  category: CATEGORY;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsDate()
  created_time: Date;

  @ApiProperty()
  @IsNumber()
  comment_count: number;

  @ApiProperty()
  @IsNumber()
  emotion_count: number;

  @ApiProperty()
  @IsNumber()
  view_count: number;
}
