import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { ChallengeService } from './challenge.service.';
import { User } from './decorators/user.decorator';
import { AddChallengeDto } from './dto/add-challenge.dto';
import { ChallengeEntity } from './entities/challenge.entity';
@Controller('challenge')
export class ChallengeController {
    constructor(private challengeService: ChallengeService) { }
    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async getChallengesOfUser(@User() user: UserEntity): Promise<ChallengeEntity[]> {
        console.log('user is ', user)
        console.log('GET challenge Entity');
        return await this.challengeService.getChallenges(user);
    }
    @Get('/currentuser')
    @UseGuards(JwtAuthGuard)
    async getChallengeOfCurrentUser(@User() user: UserEntity): Promise<ChallengeEntity[]> {
        console.log('user is ', user)
        console.log('GET challenge Entity');
        if (user.role === UserRoleEnum.ADMIN)
            return await this.challengeService.getChallenges(user);
        return await this.challengeService.getChallengeofCurrentUSer(user);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getChallengeById(@Param('id', ParseIntPipe) id: number): Promise<ChallengeEntity> {
        console.log('GET challenge by id');
        return await this.challengeService.findChallengeByID(id);
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    async addChallenge(@Body() addChallengeDto: AddChallengeDto, @User() user): Promise<ChallengeEntity> {
        return await this.challengeService.addChallenge(addChallengeDto, user);
    }
}
