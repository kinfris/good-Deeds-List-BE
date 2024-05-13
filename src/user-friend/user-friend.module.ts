import { forwardRef, Module } from '@nestjs/common';
import { UserFriendService } from './user-friend.service';
import { UserFriendController } from './user-friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserFriend } from './entities/user-friend.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFriend, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserFriendController],
  providers: [UserFriendService],
  exports: [UserFriendService],
})
export class UserFriendModule {}
