import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    @Inject('AUTH_SERVICE') private client: ClientProxy,
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
      this.httpService.get('http://auth-http:80/auth'),
    );
    return data;
  }

  @Get('/user/nohttp')
  async userWithoutHttp(): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService.get('http://auth:8080'),
    );
    return data;
  }

  @Get('/user/auth')
  getUserAuth(): Observable<number> {
    const pattern = { cmd: 'auth' };
    const payload = [1, 2, 3];
    return this.client.send<number>(pattern, payload);
  }
}
