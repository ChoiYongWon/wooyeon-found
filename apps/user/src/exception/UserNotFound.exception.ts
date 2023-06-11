import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super({ message: '유저 정보가 없습니다.' }, HttpStatus.NOT_FOUND);
  }
}
