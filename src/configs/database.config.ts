import { registerAs } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

export default registerAs(
  'database',
  (): MongooseModuleFactoryOptions => ({
    uri: process.env.MONGODB_URI,
  }),
);
