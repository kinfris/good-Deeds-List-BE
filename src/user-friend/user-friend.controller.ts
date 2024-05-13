import { Controller, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { UserFriendService } from './user-friend.service';
import { AddUserFriendDto } from './dto/add-user-friend.dto';
import { DeleteUserFriendDto } from './dto/delete-user-friend.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as RequestUser } from '../decorator/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('user-friend')
export class UserFriendController {
  constructor(private readonly userFriendService: UserFriendService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addFriend(@Body() { friendId }: AddUserFriendDto, @RequestUser() user: User) {
    return this.userFriendService.addFriend(user.id, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteFriend(
    @Body() { friendId }: DeleteUserFriendDto,
    @RequestUser() user: User,
  ) {
    return this.userFriendService.deleteFriend(user.id, friendId);
  }
}
