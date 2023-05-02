import { Injectable } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class MessageHandler {
  @SqsMessageHandler(/** name: */ 'testQueue', /** batch: */ false)
  public async handleMessage(message: Message) {
    console.log(message);
  }

  @SqsConsumerEventHandler(
    /** name: */ 'testQueue',
    /** eventName: */ 'processing_error',
  )
  public onProcessingError(error: Error, message: Message) {
    // report errors here
  }
}
