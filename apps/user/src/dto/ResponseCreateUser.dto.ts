import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY } from '../entity/Categories';
import { ROLE } from '../entity/Roles';

export class ResponseCreateUserDto {
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
