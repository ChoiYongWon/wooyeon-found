import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { RequestCreatePostDto } from './dto/request/CreatePost.dto';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/post')
  getHello(): string {
    return this.postService.getHello();
  }

  @Get('/post/count')
  async getPostCount() {
    return await this.postService.getPostCount();
  }

  @Get('/post/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/post/list')
  async getPost() {
    return await this.postService.testQuery();
  }

  @Post('/post')
  async addPost(@Body() body: RequestCreatePostDto) {
    return await this.postService.insertPost(body.content, body.category);
  }
}
