import { Message } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { CommentService } from './comment.service';

@Injectable()
export class MessageHandler {
  constructor(private readonly commentService: CommentService) {}
  @SqsMessageHandler(
    /** name: */ 'comment-user_deleted.fifo',
    /** batch: */ false,
  )
  public async handleUserDeletedMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    await this.commentService.deleteCommentByUserId(data.target_id);
    Logger.log(`comment-user_deleted.fifo ${data.target_id}`);
  }

  @SqsMessageHandler(
    /** name: */ 'comment-post_deleted.fifo',
    /** batch: */ false,
  )
  public async handlePostDeletedMessage(message: Message) {
    const data = JSON.parse(JSON.parse(message.Body).Message);
    await this.commentService.deleteCommentByPostId(data.target_id);
    Logger.log(`comment-post_deleted.fifo ${data.target_id}`);
  }
}
