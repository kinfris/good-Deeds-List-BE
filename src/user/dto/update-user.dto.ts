import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 45, { message: 'Не меньше 4 и не больше 45' })
  readonly displayName: string;

  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
}
