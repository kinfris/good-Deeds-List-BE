import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFriend } from './entities/user-friend.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class UserFriendService {
  constructor(
    @InjectRepository(UserFriend)
    private readonly userFriendRepository: Repository<UserFriend>,
    private userService: UserService,
  ) {}

  async addFriend(userId: number, friendId: number) {
    try {
      if (userId === friendId) {
        throw new HttpException(
          'Id пользователя не должно быть равно Id друга',
          HttpStatus.FORBIDDEN,
        );
      }
      const userFriend1 = this.userFriendRepository.create({
        userId,
        friendId,
      });

      const userFriend2 = this.userFriendRepository.create({
        userId: friendId,
        friendId: userId,
      });

      await this.userFriendRepository.save([userFriend1, userFriend2]);
      return userFriend1;
    } catch (e) {
      throw new HttpException(
        '2 пользователя уже дружат',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async addFriendByName(userId: number, displayName: string) {
    try {
      const user = await this.userService.findByName(displayName);
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      if (userId === user.id) {
        throw new HttpException(
          'Id пользователя не должно быть равно Id друга',
          HttpStatus.FORBIDDEN,
        );
      }
      const userFriend1 = this.userFriendRepository.create({
        userId,
        friendId: user.id,
      });

      const userFriend2 = this.userFriendRepository.create({
        userId: user.id,
        friendId: userId,
      });

      await this.userFriendRepository.save([userFriend1, userFriend2]);
      return userFriend1;
    } catch (e) {
      throw new HttpException(
        '2 пользователя уже дружат',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteFriend(userId: number, friendId: number) {
    try {
      const deleteResult1 = await this.userFriendRepository.delete({
        userId,
        friendId,
      });

      const deleteResult2 = await this.userFriendRepository.delete({
        userId: friendId,
        friendId: userId,
      });

      console.log('deleteResult1 -', deleteResult1);
      console.log('deleteResult2 -', deleteResult2);

      if (deleteResult1.affected === 0 || deleteResult2.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  findRelationship(userIdOne: number, userIdTwo: number) {
    try {
      return this.userFriendRepository.findOne({
        where: {
          userId: userIdOne,
          friendId: userIdTwo,
        },
      });
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
