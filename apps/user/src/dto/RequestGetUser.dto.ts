import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestGetUserDto {
  @ApiProperty()
  @IsString()
  email: string;
}
