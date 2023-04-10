import { NestFactory } from '@nestjs/core';
import { EmotionModule } from './emotion.module';

async function bootstrap() {
  const app = await NestFactory.create(EmotionModule);
  await app.listen(80);
}
bootstrap();
