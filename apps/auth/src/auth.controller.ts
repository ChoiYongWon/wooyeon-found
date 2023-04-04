import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth')
  getHello(): string {
    return this.authService.getHello();
  }

  @Get('/auth/healthcheck')
  healthCheck(): number {
    return 200;
  }
}
