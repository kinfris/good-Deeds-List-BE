import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from './dto/query.dto';
import { findUsersSelectDto } from './dto/search.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  createUser(createUserDto: CreateUserDto) {
    const userEntity = this.userRepository.create({
      displayName: createUserDto.displayName,
      email: createUserDto.email,
      passwordHash: createUserDto.password,
    });
    return this.userRepository.save(userEntity);
  }

  async findAll(query: QueryDto) {
    const limit = +query.limit || 10;
    const page = +query.page || 1;
    const skip = (page - 1) * limit;

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: findUsersSelectDto,
      relations: ['friends'],
      take: limit,
      skip,
    });

    return {
      data: users,
      totalCount,
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      select: findUsersSelectDto,
      relations: ['friends'],
      where: { id },
    });
  }

  async findByEmail(email: string, displayName: string = '') {
    return this.userRepository.findOne({ where: [{ email }, { displayName }] });
  }

  async findByName(displayName: string = '') {
    return this.userRepository.findOne({ where: { displayName } });
  }

  async deleteUser(userId: number) {
    const deleteResult = await this.userRepository.delete(userId);
    console.log(deleteResult);
    if (deleteResult.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const userRow = await this.userRepository
      .createQueryBuilder()
      .update(User, updateUserDto)
      .where({ id: userId })
      .returning('*')
      .updateEntity(true)
      .execute();

    if (userRow.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return userRow.raw;
  }
}
