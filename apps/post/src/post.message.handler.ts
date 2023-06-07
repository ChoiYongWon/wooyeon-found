import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { PostService } from './post.service';
import { MessageDTO } from '@app/common/dto/Message.dto';

@Injectable()
export class MessageHandler {
  constructor(private readonly postService: PostService) {}
  @SqsMessageHandler(/** name: */ 'post-user_deleted.fifo', /** batch: */ false)
  public async handleUserDeletedMessage(message: Message) {
    const data: MessageDTO = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.deleteAllPostByUser(data.target_id);
    Logger.log(`post-user_deleted.fifo ${data.target_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-comment_deleted.fifo',
    /** batch: */ false,
  )
  public async handleCommentDeletedMessage(message: Message) {
    const data: MessageDTO = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.decreaseComment(data.target_id);
    Logger.log(`post-comment_deleted.fifo ${data.target_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-comment_created.fifo',
    /** batch: */ false,
  )
  public async handleCommentCreatedMessage(message: Message) {
    const data: MessageDTO = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.increaseComment(data.target_id);
    Logger.log(`post-comment_created.fifo ${data.target_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-emotion_deleted.fifo',
    /** batch: */ false,
  )
  public async handleEmotionDeletedMessage(message: Message) {
    const data: MessageDTO = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.decreaseEmotion(data.target_id);
    Logger.log(`post-emotion_deleted.fifo ${data.target_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-emotion_created.fifo',
    /** batch: */ false,
  )
  public async handleEmotionCreatedMessage(message: Message) {
    const data: MessageDTO = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.increaseEmotion(data.target_id);
    Logger.log(`post-emotion_created.fifo ${data.target_id}`);
  }
}

//npm run start:dev comment
