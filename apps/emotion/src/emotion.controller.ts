import { Controller, Get, Query } from '@nestjs/common';
import { EmotionService } from './emotion.service';

@Controller()
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  // @Get('/emotion')
  // getHello(): string {
  //   return this.emotionService.getHello();
  // }

  @Get('/emotion/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/emotion')
  getComment(@Query() query) {
    return this.emotionService.getComment(query.post_id);
  }
}
