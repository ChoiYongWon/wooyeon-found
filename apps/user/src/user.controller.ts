import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
//http://localhost/user/api#/

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
