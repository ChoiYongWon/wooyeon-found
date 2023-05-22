import { Message } from "@aws-sdk/client-sqs";
import { Injectable } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";

@Injectable()
export class MessageHandler {
    @SqsMessageHandler( /** name: */ 'comment-user_deleted.fifo', /** batch: */ false)
    public async handleMessage(message: Message) {
        console.log(message);
    }
}