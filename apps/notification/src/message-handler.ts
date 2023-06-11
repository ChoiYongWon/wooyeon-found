import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { NotificationService } from './notification.service';
import { RequestCreateNotificationDto } from './dto/request/CreateNotification.dto';
import { NOTIFICATION } from '@app/common/enums/notification.enum';

@Injectable()
export class MessageHandler {
  constructor(private readonly notificationService: NotificationService) {}
  @SqsMessageHandler(
    /** name: */ 'notification-comment_created.fifo',
    /** batch: */ false,
  )
  public async handleCommentCreatedMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    const notificationData: RequestCreateNotificationDto = {
      target_id: data.target_id,
      user_id: data.user_id,
      type: NOTIFICATION.COMMENT,
      content: `새로운 댓글이 달렸습니다 ${data.content}`,
    };
    await this.notificationService.createNotification(notificationData);
    Logger.log(`notification-comment_created.fifo ${notificationData}`);
  }

  @SqsMessageHandler(
    /** name: */ 'notification-emotion_created.fifo',
    /** batch: */ false,
  )
  public async handleEmotionCreatedMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    const notificationData: RequestCreateNotificationDto = {
      target_id: data.target_id,
      user_id: data.user_id,
      type: NOTIFICATION.EMOTION,
      content: `새로운 감정표현이 달렸습니다 ${data.content}`,
    };
    await this.notificationService.createNotification(notificationData);
    Logger.log(`notification-emotion_created.fifo ${notificationData}`);
  }

  @SqsMessageHandler(/** name: */ 'notification-chat.fifo', /** batch: */ false)
  public async handleChatMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    const notificationData: RequestCreateNotificationDto = {
      target_id: data.target_id,
      user_id: data.user_id,
      type: NOTIFICATION.CHAT,
      content: `새로운 채팅이 왔습니다. 익명 : ${data.content}`,
    };
    Logger.log(`notification-chat.fifo ${notificationData}`);
  }
}

//npm run start:dev comment
