import { ApiProperty } from '@nestjs/swagger';

export class ResponseReadGroupListDto {
  @ApiProperty()
  group_id: string;

  @ApiProperty()
  is_own: string;
}
