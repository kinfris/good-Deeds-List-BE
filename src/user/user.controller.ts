import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as RequestUser } from '../decorator/user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from './dto/query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Param('id') id: string, @RequestUser() user: User) {
    return this.userService.deleteUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser(@Body() updateUserDto: UpdateUserDto, @RequestUser() user: User) {
    return this.userService.updateUser(user.id, updateUserDto);
  }
}
