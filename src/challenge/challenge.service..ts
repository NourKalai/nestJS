import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AddChallengeDto } from './dto/add-challenge.dto';
import { ChallengeEntity } from './entities/challenge.entity';

@Injectable()
export class ChallengeService {
    constructor(
        @InjectRepository(ChallengeEntity)
        private ChallengeRepository: Repository<ChallengeEntity>, private jwtService: JwtService) { }

    async getChallenges(user: UserEntity): Promise<ChallengeEntity[]> {
        return await this.ChallengeRepository.find({
            where: {
                creator: user == user
            },
            relations: ['creator']
        });
    }
    async getChallengeofCurrentUSer(user): Promise<ChallengeEntity[]> {
        const { id } = await user;
        
        const challenges = await this.ChallengeRepository
            .createQueryBuilder("challenge")
            .leftJoinAndSelect("challenge.creator", "creator")
            .where("creator.id =:id", { id: id })
            .getMany();
        return challenges;
    }
    async findChallengeByID(id: number,): Promise<ChallengeEntity> {
        const FindChallenge = await this.ChallengeRepository.preload({ id })
        if (!FindChallenge) { throw new NotFoundException(`le challenge d'id ${id} n'existe pas  `) }
        return await this.ChallengeRepository.findOneById(id);

    }
    async addChallenge(challenge: AddChallengeDto, user: UserEntity): Promise<ChallengeEntity> {
        console.log("adding..");
        const newChallenge = this.ChallengeRepository.create(challenge);
        newChallenge.creator = user;
        

        return await this.ChallengeRepository.save(newChallenge);
    }
}
