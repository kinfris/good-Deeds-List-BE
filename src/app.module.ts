import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserFriendModule } from './user-friend/user-friend.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserFriend } from './user-friend/entities/user-friend.entity';
import { GoodDeedModule } from './good-deed/good-deed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      entities: [User, UserFriend],
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    UserFriendModule,
    AuthModule,
    GoodDeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
