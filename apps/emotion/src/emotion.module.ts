import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';
import { MessageHandler } from './emotion.message.handler';
import { Emotion } from './entity/emotion.entity';
import * as morgan from 'morgan';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([Emotion]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [Emotion],
      synchronize: true,
    }),
    SqsModule.register({
      consumers: [
        // 받는거
        {
          name: 'emotion-user_deleted.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/emotion-user_deleted.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'emotion-post_deleted.fifo',
          queueUrl: `${process.env.SQS_URL}/emotion-post_deleted.fifo`,
          region: 'ap-northeast-2',
        },
      ],
      producers: [], // 이벤트 발행
    }),
    CommonModule,
    SnsModule,
    HttpModule,
  ],
  controllers: [EmotionController],
  providers: [EmotionService, MessageHandler],
})
export class EmotionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('tiny'))
      .exclude('/emotion/healthcheck')
      .forRoutes('*');
  }
}
