import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { GoodDeedService } from './good-deed.service';
import { CreateGoodDeedDto } from './dto/create-good-deed.dto';
import { UpdateGoodDeedDto } from './dto/update-good-deed.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as RequestUser } from '../decorator/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('good-deed')
export class GoodDeedController {
  constructor(private readonly goodDeedService: GoodDeedService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createGoodDeedDto: CreateGoodDeedDto,
    @RequestUser() user: User,
  ) {
    return this.goodDeedService.create(user.id, createGoodDeedDto);
  }

  @Get('all')
  findAll() {
    return this.goodDeedService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findByUser(@Param('userId') userId: string, @RequestUser() user: User) {
    return this.goodDeedService.findByUser(+userId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findByAuthorizedUser(@RequestUser() user: User) {
    return this.goodDeedService.findByAuthorizedUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':goodDeedId')
  update(
    @Param('goodDeedId') goodDeedId: string,
    @Body() updateGoodDeedDto: UpdateGoodDeedDto,
    @RequestUser() user: User,
  ) {
    return this.goodDeedService.update(+goodDeedId, updateGoodDeedDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @RequestUser() user: User) {
    return this.goodDeedService.remove(+id, user.id);
  }
}
