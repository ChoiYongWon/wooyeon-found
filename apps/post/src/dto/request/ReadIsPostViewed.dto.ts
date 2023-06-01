import { CATEGORY } from '@app/common/enums/category.enum';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

export class RequestReadIsPostViewedDto {
  @ApiProperty()
  @IsUUID()
  post_id: string;

  @ApiProperty()
  @IsUUID()
  user_id: string;
}
