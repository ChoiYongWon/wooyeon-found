import { HttpException, HttpStatus } from '@nestjs/common';

export class NeedKakaoEmailException extends HttpException {
  constructor() {
    super({ message: '이메일을 허용해야합니다.' }, HttpStatus.NOT_ACCEPTABLE);
  }
}
