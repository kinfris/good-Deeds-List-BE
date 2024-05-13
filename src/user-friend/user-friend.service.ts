import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFriend } from './entities/user-friend.entity';

@Injectable()
export class UserFriendService {
  constructor(
    @InjectRepository(UserFriend)
    private readonly userFriendRepository: Repository<UserFriend>,
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

  async deleteFriend(userId: number, friendId: number) {
    const deleteResult = await this.userFriendRepository.delete({
      userId,
      friendId,
    });
    if (deleteResult.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return 'friend deleted';
  }

  findRelationship(userIdOne: number, userIdTwo: number) {
    return this.userFriendRepository.findOne({
      where: {
        userId: userIdOne,
        friendId: userIdTwo,
      },
    });
  }
}
