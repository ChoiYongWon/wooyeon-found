import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { ROLE } from '../entity/Roles';
import { CATEGORY } from '@app/common/enums/category.enum';

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
