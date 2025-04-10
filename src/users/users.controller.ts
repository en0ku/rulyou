import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto/create-or-update-user.dto';
import { UsersService } from './users.service';
import { GetUserQueryDto } from './dto/get-user-query.dto';
import { GetOrDeleteUserParamsDto } from './dto/get-or-delete-user-params.dto';
import { UpdateUserParamsDto } from './dto/update-user-params.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() user: CreateOrUpdateUserDto) {
    return await this.usersService.createUser(user);
  }

  @Get(['get', 'get/:id'])
  async getUsers(
    @Param() param?: GetOrDeleteUserParamsDto,
    @Query() query?: GetUserQueryDto,
  ) {
    const users = await this.usersService.getUsers({
      ...param,
      ...query,
    });
    return { users };
  }

  @Patch('update/:id')
  async updateUser(
    @Param() param: UpdateUserParamsDto,
    @Body() body: CreateOrUpdateUserDto,
  ) {
    const { id } = param;
    return await this.usersService.updateUser(id, body);
  }

  @Delete(['delete', 'delete/:id'])
  async deleteUser(@Param() param: GetOrDeleteUserParamsDto) {
    const { id } = param;
    return await this.usersService.deleteUser(id);
  }
}
