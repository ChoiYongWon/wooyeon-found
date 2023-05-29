import { HttpException, HttpStatus } from '@nestjs/common';

export class EmotionDuplicatedException extends HttpException {
  constructor() {
    super({ message: '이미 좋아요를 누르셨습니다.' }, HttpStatus.BAD_REQUEST);
  }
}
