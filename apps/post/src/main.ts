import { NestFactory } from '@nestjs/core';
import { PostModule } from './post.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  console.log(process.env.NODE_ENV);
  const config = new DocumentBuilder()
    .setTitle('우연한 발견 API')
    .setDescription('우연한 발견 API 문서')
    .setVersion('2.0')
    .addTag('post')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/post/api', app, document);
  await app.listen(80);
}
bootstrap();
