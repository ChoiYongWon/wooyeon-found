import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'http://auth',
      port: 8080,
    },
  });
  await app.startAllMicroservices();
  await app.listen(80);
}
bootstrap();
