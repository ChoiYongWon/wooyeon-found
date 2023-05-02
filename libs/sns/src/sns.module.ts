import { Module } from '@nestjs/common';
import SnsService from './sns.service';
import { SNSClient } from '@aws-sdk/client-sns';

@Module({
  providers: [SnsService],
  exports: [SnsService],
})
export class SnsModule {}
