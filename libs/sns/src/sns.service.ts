// Package.
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

// Internal.
// import { AppConfigService, Stage } from '@lib/config';
// import { Logger } from '@lib/logger';

// Code.
@Injectable()
export default class SnsService {
  private client: SNSClient;

  constructor() {
    this.client = new SNSClient({
      region: 'ap-northeast-2',
    });
  }

  async publishMessage(payload: any, topic: string) {
    const input = {
      TopicArn: `${process.env.SNS_TOPIC_ARN}:${topic}.fifo`,
      Message: JSON.stringify(payload), // required
      MessageDeduplicationId: uuid(),
      MessageGroupId: topic,
    };

    //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html
    const command = new PublishCommand(input);
    const response = await this.client.send(command);
    return {
      response,
    };
  }
}
