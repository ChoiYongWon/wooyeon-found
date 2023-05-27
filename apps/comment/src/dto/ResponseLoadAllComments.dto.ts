import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY } from '../entity/Categories';
import { ROLE } from '../entity/Roles';

export class ResponseLoadAllCommentsDto {
  @ApiProperty()
  comment_id: string;

  @ApiProperty()
  post_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;
}
