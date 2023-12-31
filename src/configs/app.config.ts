import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.APP_HOST,
  port: process.env.APP_PORT || 3000,
  salt: process.env.APP_SALT || 10,
}));
