import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';
import { SqsModule } from '@ssut/nestjs-sqs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { MessageHandler } from './comment.message.handler';
import * as morgan from 'morgan';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [Comment],
      synchronize: true,
    }),
    SqsModule.register({
      consumers: [
        // 받는거
        {
          name: 'comment-user_deleted.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/comment-user_deleted.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'comment-post_deleted.fifo',
          queueUrl: `${process.env.SQS_URL}/comment-post_deleted.fifo`,
          region: 'ap-northeast-2',
        },
      ],
      producers: [], // 이벤트 발행
    }),
    CommonModule,
    SnsModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, MessageHandler],
})
export class CommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('tiny')).forRoutes('*');
  }
}
