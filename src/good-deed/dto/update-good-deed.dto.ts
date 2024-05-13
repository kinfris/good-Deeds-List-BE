import { PartialType } from '@nestjs/mapped-types';
import { CreateGoodDeedDto } from './create-good-deed.dto';

export class UpdateGoodDeedDto extends PartialType(CreateGoodDeedDto) {}
