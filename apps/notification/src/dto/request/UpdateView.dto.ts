import { NOTIFICATION } from '@app/common/enums/notification.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

export class RequestUpdateViewDto {
  @ApiProperty()
  @IsUUID()
  notification_id: string;
}
