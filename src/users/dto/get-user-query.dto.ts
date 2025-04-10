import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { User as IUser } from '../user.interface';
import { Type } from 'class-transformer';

export class GetUserQueryDto implements Omit<IUser, 'id'> {
  @Length(1, 255, {
    message: (args) =>
      `${args.property} должно иметь длину больше ${args.constraints[0]} и меньше ${args.constraints[1]}`,
  })
  @IsString({ message: (args) => `${args.property} должно быть строкой` })
  @IsOptional()
  full_name: string;

  @Length(1, 64, {
    message: (args) =>
      `${args.property} должно иметь длину больше ${args.constraints[0]} и меньше ${args.constraints[1]}`,
  })
  @IsString({ message: (args) => `${args.property} должно быть строкой` })
  @IsOptional()
  role: string;

  @Min(0, {
    message: (args) =>
      `${args.property} должно быть больше или равно ${args.constraints}`,
  })
  @Max(100, {
    message: (args) =>
      `${args.property} должно быть меньше или равно ${args.constraints}`,
  })
  @Type(() => Number)
  @IsNumber({}, { message: (args) => `${args.property} должно быть числом` })
  @IsOptional()
  efficiency: number;
}
