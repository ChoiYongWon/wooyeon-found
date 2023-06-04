import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { KakaoAuthGuard } from './guard/kakao.guard';

// @UseGuards(RolesGuard)
// @UseGuards(JwtAuthGuard)
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/kakao')
  @ApiOperation({
    summary:
      '유저 카카오 소셜 로그인. (프론트에서 a태그로 접속하시면 됩니다.) 로그인이 완료되면 /auth/kakao/redirect?access_token=<토큰값>으로 리다이렉트됩니다.',
  })
  // @ApiCreatedResponse({ status: 200, type: ResponseUserLoginDto })
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/oauth')
  @ApiOperation({
    summary: '카카오 Redirect URL. (프론트에서 요청하는 API가 아닙니다.)',
  })
  @UseGuards(KakaoAuthGuard)
  async kakaoRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.userLogin(req.user);
    // res.cookie('jwt', result.access_token, {
    //   httpOnly: false,
    //   maxAge: 24 * 60 * 60 * 1000, //1 day
    //   // maxAge: 10 * 1000, //1 day
    // });
    // res.setHeader('Authorization', 'Bearer ' + result.access_token);
    // res.redirect(
    //   `${process.env.CLIENT_URL}/auth/kakao/redirect?access_token=${result.access_token}`,
    // );
    res.redirect(
      `https://gentle-beignet-4eeb29.netlify.app/auth/kakao/redirect?access_token=${result.access_token}`,
    );
  }
}
