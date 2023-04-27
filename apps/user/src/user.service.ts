// import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { userRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: userRepository) {}
}
