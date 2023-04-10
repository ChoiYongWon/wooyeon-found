import { Module } from '@nestjs/common';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';

@Module({
  imports: [],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
