import { HttpException, HttpStatus } from '@nestjs/common';

export class EmotionDeleteDuplicatedException extends HttpException {
  constructor() {
    super({ message: '누른 좋아요가 없습니다.' }, HttpStatus.BAD_REQUEST);
  }
}
