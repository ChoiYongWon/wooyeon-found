import { ApiProperty } from '@nestjs/swagger';

export class ResponseReadChatDto {
  @ApiProperty()
  chat_id: string;

  @ApiProperty()
  is_own: boolean;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_at: Date;
}
