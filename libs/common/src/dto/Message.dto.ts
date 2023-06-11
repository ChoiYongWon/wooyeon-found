import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CATEGORY } from '@app/common/enums/category.enum';
import { NOTIFICATION } from '../enums/notification.enum';

export class MessageDTO {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  target_id: string;

  @ApiProperty()
  @IsString()
  content: string;
}
