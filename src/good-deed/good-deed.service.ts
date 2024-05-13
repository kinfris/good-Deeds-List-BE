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
    const areUsersFriends = await this.userFriendService.findRelationship(
      userId,
      activeUser,
    );
    if (!areUsersFriends) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.goodDeedRepository.findOne({ where: { userId } });
  }

  async update(
    goodDeedId: number,
    updateGoodDeedDto: UpdateGoodDeedDto,
    userId: number,
  ) {
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
  }

  async remove(id: number, userId: number) {
    const deleteResult = await this.goodDeedRepository.delete({
      userId,
      id,
    });
    if (deleteResult.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return 'goodDeed deleted';
  }
}
