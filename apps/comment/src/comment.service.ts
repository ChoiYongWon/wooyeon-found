import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  getHello(): string {
    return 'Hi hello';
  }
}
