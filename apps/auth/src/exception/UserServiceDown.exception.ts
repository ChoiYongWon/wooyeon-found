import { HttpException, HttpStatus } from '@nestjs/common';

export class UserServiceDownException extends HttpException {
  constructor() {
    super(
      { message: 'User 서비스가 응답이 없습니다.' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
