import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as fs from 'fs';
import { swagger } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService: ConfigService<any> = app.get(ConfigService);
  const host = configService.get('app.host');
  const port = configService.get('app.port');
  const swagger_user = configService.get('SWAGGER_USER');
  const swagger_password = configService.get('SWAGGER_PASSWORD');
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    ['/api/docs', '/api/swagger-docs'],
    basicAuth({
      challenge: true,
      users: {
        [swagger_user]: swagger_password,
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, swagger);

  await fs.writeFileSync('./swagger-docs.json', JSON.stringify(document));
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000, () => {
    console.log(`Started on ${host}:${port}/api`);
    console.log(`Swagger on ${host}:${port}/api/docs`);
  });
}
void bootstrap();
