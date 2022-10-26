import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { PayloadInterface } from '../interfaces/payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { IsEmail } from 'class-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('SECRET_KEY'),
        });
    }

    async validate(payload: PayloadInterface) {
        const { email, id } = payload;
        //récupérer user
        const user = await this.userRepository.findOneById(id);
        // si le user existe je le retourne dans validate et sera automatiquement dans request
        if (payload) {
            const { password, salt, ...result } = user;
            return result;
        } else {
            //si non je déclenche une erreur
            throw new UnauthorizedException();
        }
    }
}