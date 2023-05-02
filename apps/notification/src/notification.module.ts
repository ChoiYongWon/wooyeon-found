import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './message-handler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    SqsModule.register({
      consumers: [
        {
          name: 'testQueue', // name of the queue
          queueUrl: `${process.env.SQS_URL}/testQueue`,
          region: 'ap-northeast-2', // url of the queue,
        },
      ],
      producers: [],
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, MessageHandler],
})
export class NotificationModule {}
