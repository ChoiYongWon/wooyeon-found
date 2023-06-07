import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ResponseReadOwnNotificationCountDto {
  @ApiProperty()
  @IsNumber()
  count: number;
}
