import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    CommonModule,
    SnsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
