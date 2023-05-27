import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { CATEGORY } from '../entity/Categories';
import { ROLE } from '../entity/Roles';
export class ResponseGetUserDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  category: CATEGORY[];

  @ApiProperty()
  role: ROLE;
}
