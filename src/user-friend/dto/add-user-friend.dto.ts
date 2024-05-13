import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUserFriendDto {
  @IsNumber()
  @IsNotEmpty()
  friendId: number;
}
