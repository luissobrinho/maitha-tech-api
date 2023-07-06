import { DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_TODO_LIST_TAG = 'Todo List';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('./../../package.json').version;

export const swagger = new DocumentBuilder()
  .setTitle('Serviço')
  .setDescription('Está é a documentação do serviç')
  .setExternalDoc('Open API 3.0 (Swagger Docs)', '/api/swagger-docs')
  .setVersion(version)
  .addTag(SWAGGER_TODO_LIST_TAG)
  .build();
