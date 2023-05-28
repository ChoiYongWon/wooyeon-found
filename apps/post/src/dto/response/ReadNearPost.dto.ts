import { CATEGORY } from '@app/common/enums/category.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class ResponseReadNearPostDto {
  @ApiProperty()
  @IsString()
  post_id: string;

  @ApiProperty()
  @IsEnum(CATEGORY)
  category: CATEGORY;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsArray()
  image: string[];
}
