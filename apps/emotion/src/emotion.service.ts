import { Injectable } from '@nestjs/common';

@Injectable()
export class EmotionService {
  comment = [
    {
      id: 0,
      post_id: 0,
      comment: '안녕하세요',
    },
    {
      id: 1,
      post_id: 0,
      comment: '멋져요',
    },
    {
      id: 2,
      post_id: 1,
      comment: '대박이에요',
    },
  ];

  getComment(post_id: number) {
    return this.comment.filter((i) => i.post_id == post_id);
  }
  getHello(): string {
    return 'Hello World Emotion Service Ver. 1';
  }
}
