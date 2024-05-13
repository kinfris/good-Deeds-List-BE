import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 45' })
  readonly displayName: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
}
