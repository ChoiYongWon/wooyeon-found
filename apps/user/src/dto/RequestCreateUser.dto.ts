import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsString } from 'class-validator';
import { ROLE } from '../entity/Roles';
import { CATEGORY } from '@app/common/enums/category.enum';

export class RequestCreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsEnum(CATEGORY, { each: true })
  @IsArray()
  category: CATEGORY[];
}
