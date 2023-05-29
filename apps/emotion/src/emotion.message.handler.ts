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
    const user_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.emotionService.deleteEmotionByUserId(user_id);
    Logger.log(`emotion-user_deleted.fifo ${user_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'emotion-post_deleted.fifo',
    /** batch: */ false,
  )
  public async handlePostDeletedMessage(message: Message) {
    const post_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.emotionService.deleteEmotionByPostId(post_id);
    Logger.log(`emotion-post_deleted.fifo ${post_id}`);
  }
}
