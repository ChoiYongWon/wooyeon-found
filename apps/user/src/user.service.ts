import SnsService from '@app/sns/sns.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { RequestCreateUserDto } from './dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { ResponseGetUserDto } from './dto/ResponseGetUser.dto';
import { CATEGORY } from './entity/Categories';
import { ROLE } from './entity/Roles';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly snsService: SnsService, // 따로 빼줘야한다
  ) {}

  async create(userData: RequestCreateUserDto) {
    const user = this.usersRepository.create({
      ...userData,
      role: ROLE.USER,
      // category: [CATEGORY.CATEGORY1, CATEGORY.CATEGORY2],
    });
    return await this.usersRepository.save(user);
  }

  async findOne(user_id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<ResponseGetUserDto> {
    return await this.usersRepository.findOne({
      where: {
        email,
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

  async delete(userID: string): Promise<number> {
    const user = await this.usersRepository.delete(userID);
    if (user.affected != 0) {
      await this.snsService.publishMessage(
        // 어떤 user_id가 삭제됐는지 다른 서비스에 알려야함
        userID,
        'user_deleted',
      );
      return 200;
    }
    return 200;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
}
