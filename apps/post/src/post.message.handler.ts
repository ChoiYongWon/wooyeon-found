import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { PostService } from './post.service';

@Injectable()
export class MessageHandler {
  constructor(private readonly postService: PostService) {}
  @SqsMessageHandler(/** name: */ 'post-user_deleted.fifo', /** batch: */ false)
  public async handleUserDeletedMessage(message: Message) {
    const user_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.deleteAllPostByUser(user_id);
    Logger.log(`post-user_deleted.fifo ${user_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-comment_deleted.fifo',
    /** batch: */ false,
  )
  public async handleCommentDeletedMessage(message: Message) {
    const post_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.decreaseComment(post_id);
    Logger.log(`post-comment_deleted.fifo ${post_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-comment_created.fifo',
    /** batch: */ false,
  )
  public async handleCommentCreatedMessage(message: Message) {
    const post_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.increaseComment(post_id);
    Logger.log(`post-comment_created.fifo ${post_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-emotion_deleted.fifo',
    /** batch: */ false,
  )
  public async handleEmotionDeletedMessage(message: Message) {
    const post_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.decreaseEmotion(post_id);
    Logger.log(`post-emotion_deleted.fifo ${post_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'post-emotion_created.fifo',
    /** batch: */ false,
  )
  public async handleEmotionCreatedMessage(message: Message) {
    const post_id = JSON.parse(JSON.parse(message.Body).Message);
    await this.postService.increaseEmotion(post_id);
    Logger.log(`post-emotion_created.fifo ${post_id}`);
  }
}

//npm run start:dev comment
