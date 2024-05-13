import { IsString, Length } from 'class-validator';

export class CreateGoodDeedDto {
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 200, { message: 'Не меньше 4 и не больше 200' })
  readonly title: string;
}
