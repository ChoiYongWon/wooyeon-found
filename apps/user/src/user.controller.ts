import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
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

  @Get('/user/auth')
  getUserAuth(): Observable<number> {
    const pattern = { cmd: 'auth' };
    const payload = [1, 2, 3];
    return this.client.send<number>(pattern, payload);
  }
}
