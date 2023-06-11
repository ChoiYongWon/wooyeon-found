import { CATEGORY } from '@app/common/enums/category.enum';
import { Role } from '@app/common/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

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
  role: Role;
}
