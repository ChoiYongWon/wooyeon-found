import { ApiProperty } from '@nestjs/swagger';

export class ResponseIsEmotionCheckedDto {
  @ApiProperty()
  own_emotion: boolean;
}
