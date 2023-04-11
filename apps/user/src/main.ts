import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const config = new DocumentBuilder()
    .setTitle('우연한 발견 API')
    .setDescription('우연한 발견 API 문서')
    .setVersion('2.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/user/api', app, document);
  await app.listen(80);
}
bootstrap();
