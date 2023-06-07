import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { EmotionService } from './emotion.service';

@Injectable()
export class MessageHandler {
  constructor(private readonly emotionService: EmotionService) {}
  @SqsMessageHandler(
    /** name: */ 'emotion-user_deleted.fifo',
    /** batch: */ false,
  )
  public async handleUserDeletedMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    await this.emotionService.deleteEmotionByUserId(data.target_id);
    Logger.log(`emotion-user_deleted.fifo ${data.target_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'emotion-post_deleted.fifo',
    /** batch: */ false,
  )
  public async handlePostDeletedMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    await this.emotionService.deleteEmotionByPostId(data.target_id);
    Logger.log(`emotion-post_deleted.fifo ${data.target_id}`);
  }
}
