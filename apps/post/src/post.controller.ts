import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { RequestCreatePostDto } from './dto/request/CreatePost.dto';
import { Roles } from '@app/common/decorators/roles.decorator';
import { Role } from '@app/common/enums/role.enum';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { RolesGuard } from '@app/common/guard/roles.guard';
import SnsService from '@app/sns/sns.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// @UseGuards(RolesGuard)
// @UseGuards(JwtAuthGuard)
@Controller('/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly snsService: SnsService,
    private readonly httpService: HttpService,
  ) {}

  post = [
    {
      id: 0,
      content: '안녕하세요 post 1 입니다.',
      date: '2023-05-09',
      author: '홍길동',
    },
    {
      id: 1,
      content: '안녕하세요 post 2 입니다.',
      date: '2023-05-10',
      author: '최용원',
    },
  ];

  @Get()
  async getHello() {
    // return this.postService.getHello();
    return await this.snsService.publishMessage(
      'post에서 보낸 메세지 입니다 FIFO',
      'post_deleted',
    );
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

    return 'goods';
  }

  @Get('/benchmark_by_service_connect')
  async benchmarkByServiceConnect(@Query() query) {
    const post_id = query.post_id;
    const { data } = await firstValueFrom(
      this.httpService.get(`http://emotion:80/emotion?post_id=${post_id}`),
    );
    console.log(data);
    return {
      post: this.post.filter((post) => post.id == post_id),
      comment: data,
    };
  }

  @Get('/benchmark_by_loadbalancer')
  async benchmarkByLoadBalancer(@Query() query) {
    const post_id = query.post_id;
    const { data } = await firstValueFrom(
      this.httpService.get(
        `https://api.wooyeons.site:80/emotion?post_id=${post_id}`,
      ),
    );
    console.log(data);
    return {
      post: this.post.filter((post) => post.id == post_id),
      comment: data,
    };
  }
}
