import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseReadOwnNotificationDto } from './dto/response/ReadOwnNotification.dto';
import { ResponseReadOwnNotificationCountDto } from './dto/response/ReadOwnNotificationCount.dto';
import { RequestUpdateHiddenDto } from './dto/request/UpdateHidden.dto';
import { RequestUpdateViewDto } from './dto/request/UpdateView.dto';
import SnsService from '@app/sns/sns.service';
import { NOTIFICATION } from '@app/common/enums/notification.enum';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly snsService: SnsService,
  ) {}

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/post')
  async postTest() {
    const notificationData = {
      target_id: '77ee9953-12bf-4439-95c2-83d00d5d446e',
      user_id: '66ee9953-12bf-4439-95c2-83d00d5d446e',
      content: `안녕하세요 멋지네요!`,
    };
    await this.snsService.publishMessage(notificationData, 'comment_created');
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: '사용자에게 발신된 알림을 모두 수신합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseReadOwnNotificationDto,
  })
  async readOwnNotification(@Req() req) {
    return await this.notificationService.readOwnNotification(req.user.user_id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/count')
  @ApiOperation({
    summary: '사용자에게 발신된 알림의 갯수를 반환합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseReadOwnNotificationCountDto,
  })
  async readOwnNotificationCount(@Req() req) {
    return await this.notificationService.readOwnNotificationCount(
      req.user.user_id,
    );
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/hidden')
  @ApiOperation({
    summary:
      '사용자에게 발신된 알림 하나를 숨김 처리합니다. (조회할 때 포함 x)',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  async updateHidden(@Req() req, @Body() body: RequestUpdateHiddenDto) {
    return await this.notificationService.updateHidden(req.user.user_id, body);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/view')
  @ApiOperation({
    summary:
      '사용자에게 발신된 알림 하나를 읽음 처리합니다. (조회할 때 포함 o)',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  async updateView(@Req() req, @Body() body: RequestUpdateViewDto) {
    return await this.notificationService.updateView(req.user.user_id, body);
  }
}
