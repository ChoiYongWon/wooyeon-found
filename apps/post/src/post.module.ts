import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';
import { SqsModule } from '@ssut/nestjs-sqs';
import { MessageHandler } from './post.message.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [Post],
      synchronize: true,
    }),
    SqsModule.register({
      consumers: [
        {
          name: 'post-user_deleted.fifo', // name of the queue
          queueUrl: `${process.env.SQS_URL}/post-user_deleted.fifo`,
          region: 'ap-northeast-2', // url of the queue,
        },
      ],
      producers: [],
    }),
    CommonModule,
    SnsModule,
  ],
  controllers: [PostController],
  providers: [PostService, MessageHandler],
})
export class PostModule {}
