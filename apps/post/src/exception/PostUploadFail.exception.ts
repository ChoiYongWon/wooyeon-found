import { HttpException, HttpStatus } from '@nestjs/common';

export class PostUploadFailException extends HttpException {
  constructor() {
    super({ message: '우연등록에 실패했습니다.' }, HttpStatus.BAD_REQUEST);
  }
}
