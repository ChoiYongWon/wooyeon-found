import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestGetOneUserDto {
  @ApiProperty()
  @IsString()
  user_id: string;
}
