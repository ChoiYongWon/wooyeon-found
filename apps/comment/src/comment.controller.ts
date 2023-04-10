import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/comment')
  getHello(): string {
    return this.commentService.getHello();
  }

  @Get('/comment/healthcheck')
  healthCheck(): number {
    return 200;
  }
}
