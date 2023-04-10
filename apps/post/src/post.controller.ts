import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/post')
  getHello(): string {
    return this.postService.getHello();
  }

  @Get('/post/healthcheck')
  healthCheck(): number {
    return 200;
  }
}
