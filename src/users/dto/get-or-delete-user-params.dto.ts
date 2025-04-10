import { IsNumber, IsOptional, Min } from 'class-validator';
import { User as IUser } from '../user.interface';
import { Type } from 'class-transformer';

export class GetOrDeleteUserParamsDto implements Pick<IUser, 'id'> {
  @Min(1, {
    message: (args) =>
      `${args.property} должно быть больше или равно ${args.constraints}`,
  })
  @Type(() => Number)
  @IsNumber({}, { message: (args) => `${args.property} должно быть числом` })
  @IsOptional()
  id: number;
}
