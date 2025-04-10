import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { validate } from './common/validators/env.validator';
import dbConfiguration, {
  DATABASE_CONFIG_TOKEN,
} from './common/config/db.config';
import { UsersModule } from './users/users.module';

const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [
    ConfigModule.forRoot({
      load: [dbConfiguration],
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    configService.getOrThrow(DATABASE_CONFIG_TOKEN),
  dataSourceFactory: async (options: DataSourceOptions) =>
    new DataSource(options).initialize(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.resolve('.env')],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationOptions: {},
      validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
