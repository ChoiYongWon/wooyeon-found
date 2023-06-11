import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { CATEGORY } from '@app/common/enums/category.enum';
import { Role } from '@app/common/enums/role.enum';
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
  role: Role;
}
