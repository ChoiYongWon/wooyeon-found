import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestLoadAllCommentsDto {
  @ApiProperty()
  @IsString()
  post_id: string;
}
