import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import * as morgan from 'morgan';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { SqsModule } from '@ssut/nestjs-sqs';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';
import { Chat } from './entity/chat.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([Chat]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [Chat],
      synchronize: true,
    }),
    // SqsModule.register({
    //   consumers: [
    //     // 받는거
    //     {
    //       name: 'comment-user_deleted.fifo', // name of the queue
    //       queueUrl: `${process.env.SQS_URL}/comment-user_deleted.fifo`,
    //       region: 'ap-northeast-2', // url of the queue,
    //     },
    //     {
    //       name: 'comment-post_deleted.fifo',
    //       queueUrl: `${process.env.SQS_URL}/comment-post_deleted.fifo`,
    //       region: 'ap-northeast-2',
    //     },
    //   ],
    //   producers: [], // 이벤트 발행
    // }),
    CommonModule,
    SnsModule,
    HttpModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('combined'))
      .exclude('/chat/healthcheck')
      .forRoutes('*');
  }
}
