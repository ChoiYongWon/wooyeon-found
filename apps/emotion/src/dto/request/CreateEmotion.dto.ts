import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestCreateEmotionDto {
  @ApiProperty()
  @IsString()
  post_id: string;
}
