import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { RequestCreateUserDto } from './dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: RequestCreateUserDto) {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.insert(user);
  }

  async findOne(user_id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  async update(user_id: string, userData: RequestUpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
    const userToUpdate = { ...user, ...userData };
    return await this.usersRepository.save(userToUpdate);
  }

  async delete(userID: string): Promise<void> {
    await this.usersRepository.delete(userID);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
