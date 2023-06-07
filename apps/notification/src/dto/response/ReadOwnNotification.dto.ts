import { NOTIFICATION } from '@app/common/enums/notification.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

export class ResponseReadOwnNotificationDto {
  @ApiProperty()
  @IsUUID()
  notification_id: string;

  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsUUID()
  target_id: string;

  @ApiProperty()
  @IsEnum(NOTIFICATION)
  type: NOTIFICATION;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsBoolean()
  viewed: string;

  @ApiProperty()
  @IsBoolean()
  hidden: string;

  @ApiProperty()
  @IsDate()
  created_at: Date;
}
