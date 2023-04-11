import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/user')
  getHello(): string {
    return this.userService.getHello();
  }

  @Get('/user/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/user/http')
  async userHttp(): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService.get('http://naver.com'),
    );
    return data;
  }

  @Get('/user/postCount')
  async getPostCountFromPostService(): Promise<number> {
    return await this.userService.getPostCountFromPost();
  }
}
