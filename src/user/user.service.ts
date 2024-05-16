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
    try {
      const userEntity = this.userRepository.create({
        displayName: createUserDto.displayName,
        email: createUserDto.email,
        passwordHash: createUserDto.password,
      });
      return this.userRepository.save(userEntity);
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(query: QueryDto) {
    try {
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
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  findOne(id: number) {
    try {
      return this.userRepository.findOne({
        select: findUsersSelectDto,
        relations: ['friends'],
        where: { id },
      });
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByEmail(email: string, displayName: string = '') {
    try {
      return this.userRepository.findOne({
        where: [{ email }, { displayName }],
      });
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByName(displayName: string = '') {
    try {
      return this.userRepository.findOne({ where: { displayName } });
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(userId: number) {
    try {
      const deleteResult = await this.userRepository.delete(userId);

      if (deleteResult.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    try {
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
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
