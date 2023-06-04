import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './post.message.handler';
import { HttpModule } from '@nestjs/axios';
import { Image } from './entity/image.entity';
import { View } from './entity/view.entity';
import { HttpServiceInterceptor } from './post.interceptor';
import * as morgan from 'morgan';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([Post, Image, View]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [Post, Image, View],
      synchronize: true,
    }),
    SqsModule.register({
      consumers: [
        {
          name: 'post-user_deleted.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/post-user_deleted.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'post-comment_deleted.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/post-comment_deleted.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'post-comment_created.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/post-comment_created.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'post-emotion_deleted.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/post-emotion_deleted.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
        {
          name: 'post-emotion_created.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/post-emotion_created.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
      ],
      producers: [],
    }),
    CommonModule,
    SnsModule,
    HttpModule,
  ],
  controllers: [PostController],
  providers: [
    PostService,
    MessageHandler,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: HttpServiceInterceptor,
    },
  ],
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('tiny')).exclude('/post/healthcheck').forRoutes('*');
  }
}
