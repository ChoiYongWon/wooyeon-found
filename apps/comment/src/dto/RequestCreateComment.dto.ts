import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestCreateCommentDto {
  @ApiProperty()
  @IsString()
  post_id: string;

  @ApiProperty()
  @IsString()
  content: string;
}
