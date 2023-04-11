import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
