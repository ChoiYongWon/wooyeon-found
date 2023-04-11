import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     host: 'auth',
  //     port: 8080,
  //   },
  // });
  // await app.startAllMicroservices();
  const config = new DocumentBuilder()
    .setTitle('우연한 발견 API')
    .setDescription('우연한 발견 API 문서')
    .setVersion('2.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/auth/api', app, document);
  await app.listen(80);
}
bootstrap();
