import { ConflictException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { contains, Contains } from 'class-validator';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRegisterDTO } from './dto/user-subscribe.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from 'src/enum/user-role.enum';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        private jwtService: JwtService) { }
    async getUsers(): Promise<UserEntity[]> {
        return await this.UserRepository.find();
    }
    async register(userData: AddUserDto): Promise<Partial<UserEntity>> {
        const userCreated = this.UserRepository.create({ ...userData });
        userCreated.salt = await bcrypt.genSalt();
        userCreated.password = await bcrypt.hash(userCreated.password, userCreated.salt);
        console.log('user.email= ' + userCreated.email + "user.password= " + userCreated.password);
        try {
            await this.UserRepository.save(userCreated);
        } catch (err) { throw new ConflictException('le mail existe déja') };
        // return userCreated;
        return {
            id: userCreated.id,
            email: userCreated.email,
            password: userCreated.password,
            CreatedAt: userCreated.CreatedAt,
        }
    }
    //retourner user logged in
    async login1(credentials: UserRegisterDTO): Promise<Partial<UserEntity>> {
        const { email, password } = credentials;
        //verifier s'il ya un user avec ce mail
        const user = await this.UserRepository.createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
        // si not user je déclenche une erreur
        if (!user) throw new NotFoundException(`l'adresse mail ne correspond à aucun utilisateur`);
        //si oui je vérifie le mot de passe est correct ou pas
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword == user.password) {
            return {
                email: user.email,
                role: user.role,
                id: user.id,
                name: user.name
            }

        }
        else { throw new NotFoundException(`le mot de passe est éronné`) }
    }
    //retourner un token user logged in
    async login(credentials: UserRegisterDTO) {
        const { email, password } = credentials;
        //verifier s'il ya un user avec ce mail
        const user = await this.UserRepository.createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
        // si not user je déclenche une erreur
        if (!user) throw new NotFoundException(`l'adresse mail ne correspond à aucun utilisateur`);
        //si oui je vérifie le mot de passe est correct ou pas
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword == user.password) {
            const payload = {
                email: user.email,
                role: user.role,
                id: user.id,
                name: user.name
            };
            const jwt = await this.jwtService.sign(payload);
            return { "access_token": jwt }
        }
        else { throw new NotFoundException(`le mot de passe est éronné`) }
    }

    async findUserByID(id: number,): Promise<UserEntity> {
        const FindUser = await this.UserRepository.preload({ id })
        if (!FindUser) { throw new NotFoundException(`le user d'id ${id} n'existe pas  `) }
        return await this.UserRepository.findOneById(id);

    }
    async addUser(user: AddUserDto): Promise<UserEntity> {
        console.log("adding..");

        return await this.UserRepository.save(user);
    }

    async updateUser(id: number, userUpdate: UpdateUserDto, user): Promise<UserEntity> {

        console.log("updating..");
        //On récupére le user d'id id et ensuite on remplace les anciennes valeurs de user par ceux passé en parametre
        const newUser = await this.UserRepository.preload({ id, ...userUpdate })
        // si le user d'id n'existe pas 
        if (!newUser) { throw new NotFoundException(`le user d'id ${id} n'existe pas  `) }
        //sauvegarder le nouveau user
        if (user.role === UserRoleEnum.ADMIN || (user.id === id))
            return await this.UserRepository.save(newUser);
            else throw new UnauthorizedException();
    }
    updateUser2(updateCriteria, user: UpdateUserDto) {
        return this.UserRepository.update(updateCriteria, user)
    }
    async removeUser(id: number): Promise<UserEntity> {
        const userToRemove = await this.UserRepository.findOneById(id);
        if (!userToRemove) { throw new NotFoundException(`le user d'id ${id} n'existe pas`) }
        userToRemove.IsDeleted = true;
        userToRemove.IsActive = false;
        return await userToRemove;
        //  return await this.UserRepository.remove(userToRemove);
    }
    async softRemoveUser(id: number,user) {
        const userToRemove = await this.UserRepository.findOneById(id);
        if (!userToRemove) { throw new NotFoundException(`le user d'id ${id} n'existe pas`) }
        userToRemove.IsDeleted = true;
        userToRemove.IsActive = false;
        return await this.UserRepository.softRemove(userToRemove);
    }
    async statUserNumberByType() {
        //creer un queryBuilder
        const qb = this.UserRepository.createQueryBuilder("user");
        //chercher le nombre de user par type
        qb.select("user.userTypeId,count(user.id) as numberOf")
            .groupBy("user.userTypeId");
        console.log(qb.getSql());
        return await qb.getRawMany();

    }
    async statUserByNumberOfCoins(maxCoin, minCoin) {
        //creer un queryBuilder
        const qb = this.UserRepository.createQueryBuilder("user");
        //chercher le nombre de user par type
        qb.select("user.userTypeId,count(user.id) as numberOf")
            .where("user.coins > :minCoin AND user.coins < :maxCoin", {
                minCoin: minCoin,
                maxCoin: maxCoin,
            })
            .groupBy("user.userTypeId");
        console.log(qb.getSql());
        return await qb.getRawMany();

    }
}

