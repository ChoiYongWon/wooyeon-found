import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsOptional()
  category: CATEGORY[];
}
