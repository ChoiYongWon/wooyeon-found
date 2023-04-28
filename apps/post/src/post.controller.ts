import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { RequestCreatePostDto } from './dto/request/CreatePost.dto';
import { Roles } from '@app/common/decorators/roles.decorator';
import { Role } from '@app/common/enums/role.enum';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { RolesGuard } from '@app/common/guard/roles.guard';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getHello(): string {
    return this.postService.getHello();
  }

  @Get('/count')
  async getPostCount() {
    return await this.postService.getPostCount();
  }

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/list')
  async getPost() {
    return await this.postService.testQuery();
  }

  @Post()
  async addPost(@Body() body: RequestCreatePostDto) {
    return await this.postService.insertPost(body.content, body.category);
  }

  @Get('/jwt')
  @Roles([Role.User])
  jwt(@Req() req) {
    const user_id: any = req.user.user_id;
    const role: any = req.user.role;

    console.log(user_id);
    console.log(role);

    return 'good';
  }
}
