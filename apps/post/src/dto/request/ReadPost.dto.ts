import { CATEGORY } from '@app/common/enums/category.enum';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

export class RequestReadPostDto {
  @ApiProperty()
  @IsUUID()
  post_id: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;
}
