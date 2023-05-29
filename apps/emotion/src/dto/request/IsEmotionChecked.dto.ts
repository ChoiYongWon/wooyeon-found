import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestIsEmotionCheckedDto {
  @ApiProperty()
  @IsString()
  post_id: string;
}
