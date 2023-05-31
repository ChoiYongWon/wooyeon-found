import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AuthService {
  private jwtService: JwtService;
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Auth Service 입니다';
  }
  
  async userLogin (user:any) {
    //유저 확인
    const { data } = await firstValueFrom(
      this.httpService.get('http://user:80/')
    ); 
      /*
      {
        role : "admin",
        user_id : "13124124"
      }
      */

    if(data){
      //유저 정보가 있을 시
      const payload = {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.User,
      };

      return {
        access_token: this.jwtService.sign(payload),

      }
    } else{
      //신입 유저

    }
  }
}


