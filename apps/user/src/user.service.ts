import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}
  getHello(): string {
    return 'User Service Ver. 7';
  }

  async getPostCountFromPost() {
    const { data } = await firstValueFrom(
      this.httpService.get('http://post:80/post/count'),
    );
    return data;
  }
}
