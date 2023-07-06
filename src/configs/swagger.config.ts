import { DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_AUTH_TAG = 'Auth';
export const SWAGGER_USER_TAG = 'Users';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('./../../package.json').version;

export const swagger = new DocumentBuilder()
  .setTitle('Serviço')
  .setDescription('Está é a documentação do serviço')
  .setExternalDoc('Open API 3.0 (Swagger Docs)', '/api/swagger-docs')
  .setVersion(version)
  .addTag(SWAGGER_AUTH_TAG)
  .addTag(SWAGGER_USER_TAG)
  .addBearerAuth()
  .build();
