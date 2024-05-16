import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: Partial<CreateUserDto>) {
    const user = await this.validateUser(userDto);
    console.log(user);
    const { token } = await this.generateToken(user);
    const candidate = await this.userService.findByEmail(userDto.email);
    return {
      token,
      user: {
        email: candidate.email,
        displayName: candidate.displayName,
        id: candidate.id,
      },
    };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.findByEmail(
      userDto.email,
      userDto.displayName,
    );
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.FORBIDDEN,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);

    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    const { token } = await this.generateToken(user);

    return {
      token,
      user: {
        email: user.email,
        displayName: user.displayName,
        id: user.id,
      },
    };
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      displayName: user.displayName,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: Partial<CreateUserDto>) {
    const user = await this.userService.findByEmail(userDto.email);

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user?.passwordHash || '',
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new HttpException(
      'Неверный email или пароль',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
