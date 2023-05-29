import { CATEGORY } from '@app/common/enums/category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class ResponseReadViewedPostByMonthDto {
  @ApiProperty()
  @IsString()
  post_id: string;

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
  created_at: Date;

  @ApiProperty()
  @IsArray()
  image: string[];
}
