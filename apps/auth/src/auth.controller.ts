import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth')
  getHello(): string {
    console.log('/auth');
    return this.authService.getHello();
  }

  @Get('/auth/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @MessagePattern({ cmd: 'auth' })
  async accumulate(data: number[]): Promise<number> {
    return (data || []).reduce((a, b) => a + b);
  }
}
