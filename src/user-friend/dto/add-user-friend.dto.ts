import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddUserFriendDto {
  @IsNumber()
  @IsNotEmpty()
  friendId: number;
}

export class AddUserFriendByNameDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;
}
