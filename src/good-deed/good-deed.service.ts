import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGoodDeedDto } from './dto/create-good-deed.dto';
import { UpdateGoodDeedDto } from './dto/update-good-deed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodDeed } from './entities/good-deed.entity';
import { UserFriendService } from '../user-friend/user-friend.service';

@Injectable()
export class GoodDeedService {
  constructor(
    @InjectRepository(GoodDeed)
    private readonly goodDeedRepository: Repository<GoodDeed>,
    private userFriendService: UserFriendService,
  ) {}
  create(userId: number, createGoodDeedDto: CreateGoodDeedDto) {
    const goodDeedEntity = this.goodDeedRepository.create({
      userId,
      title: createGoodDeedDto.title,
    });
    return this.goodDeedRepository.save(goodDeedEntity);
  }

  findAll() {
    return this.goodDeedRepository.find();
  }

  async findByUser(userId: number, activeUser: number) {
    try {
      const areUsersFriends = await this.userFriendService.findRelationship(
        userId,
        activeUser,
      );
      if (!areUsersFriends) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return this.goodDeedRepository.find({ where: { userId } });
    } catch (e) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async findByAuthorizedUser(userId: number) {
    try {
      return this.goodDeedRepository.find({ where: { userId } });
    } catch (e) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(
    goodDeedId: number,
    updateGoodDeedDto: UpdateGoodDeedDto,
    userId: number,
  ) {
    try {
      const goodDeedRow = await this.goodDeedRepository
        .createQueryBuilder()
        .update(GoodDeed, updateGoodDeedDto)
        .where({ id: goodDeedId, userId })
        .returning('*')
        .updateEntity(true)
        .execute();

      if (goodDeedRow.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return goodDeedRow.raw;
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const deleteResult = await this.goodDeedRepository.delete({
        userId,
        id,
      });
      if (deleteResult.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (e) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
