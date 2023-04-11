import { NestFactory } from '@nestjs/core';
import { CommentModule } from './comment.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CommentModule);
  const config = new DocumentBuilder()
    .setTitle('우연한 발견 API')
    .setDescription('우연한 발견 API 문서')
    .setVersion('2.0')
    .addTag('comment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/comment/api', app, document);
  await app.listen(80);
}
bootstrap();
