import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategy/passport.strategy';
dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: {
      expiresIn: '1h',
    }
  })],
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  exports :[JwtModule,JwtStrategy]
})
export class UserModule { }
