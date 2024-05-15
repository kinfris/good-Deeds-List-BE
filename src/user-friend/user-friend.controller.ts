import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UserFriendService } from './user-friend.service';
import {
  AddUserFriendByNameDto,
  AddUserFriendDto,
} from './dto/add-user-friend.dto';
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
  @Post('find')
  addFriendByName(
    @Body() { displayName }: AddUserFriendByNameDto,
    @RequestUser() user: User,
  ) {
    return this.userFriendService.addFriendByName(user.id, displayName);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':friendId')
  deleteFriend(@Param('friendId') friendId: string, @RequestUser() user: User) {
    return this.userFriendService.deleteFriend(user.id, +friendId);
  }
}
