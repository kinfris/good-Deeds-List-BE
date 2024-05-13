import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserFriendDto {
  @IsNumber()
  @IsNotEmpty()
  friendId: number;
}
