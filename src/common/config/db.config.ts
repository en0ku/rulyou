import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as mysql2 from 'mysql2';

export const DATABASE_CONFIG_TOKEN = 'database';

export default registerAs(DATABASE_CONFIG_TOKEN, (): TypeOrmModuleOptions => {
  return {
    type: 'mariadb',
    driver: mysql2,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
    logging:
      process.env.DB_LOG_LEVEL === 'debug'
        ? 'all'
        : ['error', 'schema', 'migration'],
    entities: [path.resolve(`${__dirname}/../../**/**.{entity,view}.{ts,js}`)],
    migrations: ['../migrations/*{.ts,.js}'],
  };
});
