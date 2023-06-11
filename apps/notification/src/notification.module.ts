import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './message-handler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { CommonModule } from '@app/common';
import { HttpModule } from '@nestjs/axios';
import * as morgan from 'morgan';
import { SnsModule } from '@app/sns';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [Notification],
      synchronize: true,
    }),
    SqsModule.register({
      consumers: [
        {
          name: 'notification-comment_created.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/notification-comment_created.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'notification-chat.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/notification-chat.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'notification-emotion_created.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/notification-emotion_created.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
      ],
      producers: [],
    }),
    CommonModule,
    HttpModule,
    SnsModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService, MessageHandler],
})
export class NotificationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('tiny'))
      .exclude('/notification/healthcheck')
      .forRoutes('*');
  }
}
