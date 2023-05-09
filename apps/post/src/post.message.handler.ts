import { Injectable } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class MessageHandler {
  @SqsMessageHandler(/** name: */ 'post-user_deleted.fifo', /** batch: */ false)
  public async handleMessage(message: Message) {
    console.log(message);
  }

  @SqsMessageHandler(
    /** name: */ 'post-comment_deleted.fifo',
    /** batch: */ false,
  )
  public async handleCommentMessage(message: Message) {
    console.log(message);
  }
}

//npm run start:dev comment
