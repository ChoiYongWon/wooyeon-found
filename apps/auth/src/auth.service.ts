import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { NeedKakaoEmailException } from './exception/NeedKakaoEmail.exception';
import { UserServiceDownException } from './exception/UserServiceDown.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Auth Service 입니다';
  }

  async userLogin(user: any) {
    if (!user.email) {
      return {
        access_token: null,
      };
    }
    //유저 확인
    const { data } = await firstValueFrom(
      this.httpService.get(`http://user:80/user/email?email=${user.email}`),
    ).catch(() => ({ data: null }));
    if (data) {
      //유저 정보가 있을 시
      const payload = {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      return {
        access_token: await this.jwtService.sign(payload),
      };
    } else {
      //그냥 아예 data가 null일때
      if (data == null)
        return {
          access_token: null,
        };
      //신입 유저
      const { data: res } = await firstValueFrom(
        this.httpService.post(`http://user:80/user/`, {
          email: data.email,
          name: data.name,
        }),
      ).catch(() => ({ data: null }));
      if (res) {
        const payload = {
          user_id: data.user_id,
          name: data.name,
          email: data.email,
          role: data.role,
        };
        return {
          access_token: await this.jwtService.sign(payload),
        };
      } else {
        return {
          access_token: null,
        };
      }
    }
  }
}
