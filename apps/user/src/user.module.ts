import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    TypeOrmModule.forFeature([User, userRepository]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_URL}`,
      port: Number(process.env.DB_PORT),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
