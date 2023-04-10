import { Injectable } from '@nestjs/common';

@Injectable()
export class EmotionService {
  getHello(): string {
    return 'Hello World Emotion Service Ver. 1';
  }
}
