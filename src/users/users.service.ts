import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserFilters, UpdateUser, UserWithoutId } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(user: UserWithoutId) {
    const entity = this.usersRepository.create(user);
    const res = await this.usersRepository.save(entity);
    return { id: res.id };
  }

  async getUsers(filters: FindUserFilters) {
    return await this.usersRepository.find({ where: filters });
  }

  async updateUser(id: number, update: UpdateUser) {
    const isUserExists = await this.usersRepository.exists({ where: { id } });
    if (!isUserExists) {
      throw new NotFoundException(`Пользователь с ID: ${id} не существует.`);
    }
    await this.usersRepository.update({ id }, update);
    return await this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(id?: number) {
    if (!id) {
      await this.usersRepository.delete({});
      return;
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID: ${id} не существует.`);
    }
    await this.usersRepository.delete({ id });
    return user;
  }
}
