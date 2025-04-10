import { Type, plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsIP,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { AppConfig, Environment } from '../../app.interface';

class EnvironmentVariables implements AppConfig {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number = 3000;

  @IsIP()
  @IsString()
  DB_HOST: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USER: string = '';

  @IsString()
  DB_PASSWORD: string = '';

  @IsString()
  DB_DATABASE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
