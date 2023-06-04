import { Strategy } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(access_token, refresh_token, profile, done): Promise<any> {
    const payload = {
      name: profile.username,
      email: profile._json.kakao_account.email ?? null,
    };
    done(null, payload);
  }
}
