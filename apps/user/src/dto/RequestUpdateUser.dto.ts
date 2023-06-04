import { IsArray, IsEmail, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY } from '@app/common/enums/category.enum';

export class RequestUpdateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsEnum(CATEGORY, { each: true })
  @IsArray()
  category: CATEGORY[];
}
