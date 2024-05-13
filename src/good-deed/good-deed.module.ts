import { forwardRef, Module } from '@nestjs/common';
import { GoodDeedService } from './good-deed.service';
import { GoodDeedController } from './good-deed.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodDeed } from './entities/good-deed.entity';
import { UserFriendModule } from '../user-friend/user-friend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoodDeed]),
    AuthModule,
    forwardRef(() => UserFriendModule),
  ],
  controllers: [GoodDeedController],
  providers: [GoodDeedService],
})
export class GoodDeedModule {}
