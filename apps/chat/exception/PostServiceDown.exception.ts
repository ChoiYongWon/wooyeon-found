import { HttpException, HttpStatus } from '@nestjs/common';

export class PostServiceDownException extends HttpException {
  constructor() {
    super(
      { message: 'Post 서비스가 응답이 없습니다.' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
