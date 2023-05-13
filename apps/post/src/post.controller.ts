import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { RequestCreatePostDto } from './dto/request/CreatePost.dto';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RequestDeletePostDto } from './dto/request/DeletePost.dto';
import { RequestReadPostDto } from './dto/request/ReadPost.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseReadNearPostDto } from './dto/response/ReadNearPost.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RequestReadNearPostDto } from './dto/request/ReadNearPost.dto';

@Controller('/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly httpService: HttpService,
  ) {}

  // post = [
  //   {
  //     id: 0,
  //     content: '안녕하세요 post 1 입니다.',
  //     date: '2023-05-09',
  //     author: '홍길동',
  //   },
  //   {
  //     id: 1,
  //     content: '안녕하세요 post 2 입니다.',
  //     date: '2023-05-10',
  //     author: '최용원',
  //   },
  // ];

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({
    summary: '하나의 우연을 업로드 합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RequestCreatePostDto })
  @UseInterceptors(
    FilesInterceptor('file', null, {
      limits: {
        files: 10,
        fileSize: 1024 * 1024 * 20,
      },
      fileFilter: (request, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          // 이미지 형식은 jpg, jpeg, png만 허용합니다.
          callback(null, true);
        } else {
          callback(
            new HttpException(
              '이미지 형식은 jpg, jpeg, png, gif만 허용합니다.',
              400,
            ),
            false,
          );
        }
      },
    }),
  )
  async createPost(
    @Body() body: RequestCreatePostDto,
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const user_id = req.user.user_id;
    return await this.postService.createPost(body, user_id, files);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  async deletePost(@Body() body: RequestDeletePostDto, @Req() req) {
    const user_id = req.user.user_id;
    return await this.postService.deletePost(body, user_id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/near')
  @ApiOperation({
    summary: '반경 100m 이내의 모든 우연을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseReadNearPostDto,
  })
  async readNearPost(@Query() query: RequestReadNearPostDto) {
    console.log(query);
    return await this.postService.readNearPost(query);
  }

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  // @Get('/benchmark_by_service_connect')
  // async benchmarkByServiceConnect(@Query() query) {
  //   const post_id = query.post_id;
  //   const { data } = await firstValueFrom(
  //     this.httpService.get(`http://emotion:80/emotion?post_id=${post_id}`),
  //   );
  //   console.log(data);
  //   return {
  //     post: this.post.filter((post) => post.id == post_id),
  //     comment: data,
  //   };
  // }

  // @Get('/benchmark_by_loadbalancer')
  // async benchmarkByLoadBalancer(@Query() query) {
  //   const post_id = query.post_id;
  //   const { data } = await firstValueFrom(
  //     this.httpService.get(
  //       `http://api.wooyeons.site:80/emotion?post_id=${post_id}`,
  //     ),
  //   );
  //   console.log(data);
  //   return {
  //     post: this.post.filter((post) => post.id == post_id),
  //     comment: data,
  //   };
  // }
}
