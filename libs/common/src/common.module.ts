import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [],
  providers: [CommonService, JwtStrategy],
  exports: [CommonService],
})
export class CommonModule {}
