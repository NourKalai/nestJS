import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { User } from 'src/challenge/decorators/user.decorator';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { AddUserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDTO } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('stats/coins')
    async statUserByCoins() {
        return await this.userService.statUserByNumberOfCoins(20, 0);
    }
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers(): Promise<UserEntity[]> {
        console.log('GET User Entity');
        return await this.userService.getUsers();
    }
    @Post('register')
    register(@Body() userData: AddUserDto): Promise<Partial<UserEntity>> {
        return this.userService.register(userData);
    }
    @Post('login')
    login1(@Body() credentials: UserRegisterDTO): Promise<Partial<UserEntity>> {
        return this.userService.login1(credentials);
    }
    @Post('login1')
    login(@Body() credentials: UserRegisterDTO) {
        return this.userService.login(credentials);
    }
    @Post()
    async addUser(@Body() addUserDto: AddUserDto): Promise<UserEntity> {
        return await this.userService.addUser(addUserDto);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateuser(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserEntity
    ) {
        return await this.userService.updateUser(id, updateUserDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateuser2(
        @Body() updateObject,
        @User() user: UserEntity
    ) {
        const { updateCriteria, updateUserDto } = updateObject
        if (user.role === UserRoleEnum.ADMIN)
            return await this.userService.updateUser2(updateCriteria, updateUserDto);
        else throw new UnauthorizedException({ "message": "You are not allowed because you are not admin" });

    }


    // // Chercher le nombre d'utilisateur de type "X" =>X : soit admin/challenger/buisness
    // @Get('stat')
    // async statUserNumberByType() {
    //     return await this.userService.statUserNumberByType();
    // }


    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async removeUser(
        @Param('id', ParseIntPipe) id: number,
        @User() user
    ) {
        // return this.userService.removeUser(id)   }
        if (user.role === UserRoleEnum.ADMIN || (user.id === id))
            return this.userService.softRemoveUser(id,user);
        else throw new UnauthorizedException();
    }
    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        console.log('GET User by id');
        return await this.userService.findUserByID(id);
    }
}