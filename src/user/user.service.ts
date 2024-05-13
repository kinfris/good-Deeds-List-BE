import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        displayName: true,
        email: true,
        friends: {
          id: true,
          displayName: true,
          email: true,
        },
      },
      relations: ['friends'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      select: {
        id: true,
        displayName: true,
        email: true,
        friends: {
          id: true,
          displayName: true,
          email: true,
        },
      },
      relations: ['friends'],
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async deleteUser(id: number, userId: number) {
    if (id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const deleteResult = await this.userRepository.delete(userId);

    if (deleteResult.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return 'user deleted';
  }

  async updateUser(id: number, userId: number, updateUserDto: UpdateUserDto) {
    if (id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
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
