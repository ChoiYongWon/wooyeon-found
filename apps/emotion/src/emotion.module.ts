import { Module } from '@nestjs/common';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
  ],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
