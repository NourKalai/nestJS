import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service.';
import { ChallengeEntity } from './entities/challenge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeEntity]), UserModule],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule { }
