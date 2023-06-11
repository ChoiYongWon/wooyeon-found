import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { NeedKakaoEmailException } from './exception/NeedKakaoEmail.exception';
import { UserServiceDownException } from './exception/UserServiceDown.exception';

const INTERNAL_SERVER_ERROR = 500;
const BAD_REQUEST = 400;
const EMAIL_NOT_AGREED = 400;

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
    try {
      if (!user.email) {
        throw EMAIL_NOT_AGREED;
      }

      //유저 확인
      const { data } = await firstValueFrom(
        this.httpService.get(`http://user:80/user/email?email=${user.email}`),
      ).catch((data) => {
        if (data?.response?.data?.statusCode != 404)
          throw INTERNAL_SERVER_ERROR;
        else return { data: false };
      });
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
        //신입 유저
        const { data: res } = await firstValueFrom(
          this.httpService.post(`http://user:80/user/`, {
            email: user.email,
            name: user.name,
          }),
        ).catch(() => {
          throw INTERNAL_SERVER_ERROR;
        });
        if (res) {
          const payload = {
            user_id: res.user_id,
            name: res.name,
            email: res.email,
            role: res.role,
          };
          return {
            access_token: await this.jwtService.sign(payload),
          };
        } else {
          throw BAD_REQUEST;
        }
      }
    } catch (e) {
      return {
        access_token: null,
      };
    }
  }
}
