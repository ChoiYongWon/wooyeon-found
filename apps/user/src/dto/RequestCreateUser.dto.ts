import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { CATEGORY } from '../entity/Categories';
import { ROLE } from '../entity/Roles';

export class RequestCreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  category: CATEGORY[];
}
