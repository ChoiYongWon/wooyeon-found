import { NestFactory } from '@nestjs/core';
import { PostModule } from './post.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  console.log(process.env.NODE_ENV);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

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
