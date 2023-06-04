import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@app/common';
import { SnsModule } from '@app/sns';
import { JwtModule } from '@nestjs/jwt';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { HttpModule, HttpService } from '@nestjs/axios';
import * as morgan from 'morgan';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    CommonModule,
    SnsModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('tiny')).exclude('/auth/healthcheck').forRoutes('*');
  }
}
