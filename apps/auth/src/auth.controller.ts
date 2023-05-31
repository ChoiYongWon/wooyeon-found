import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';


@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
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
}
