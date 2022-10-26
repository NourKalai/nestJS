import { ChallengeEntity } from "src/challenge/entities/challenge.entity";
import { UserRoleEnum } from "src/enum/user-role.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimestampEntities } from "../generics/timestamp.entities";
@Entity('user')
export class UserEntity extends TimestampEntities {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: "name", length: 20, nullable: true })
    name: string;
    @Column({ unique: true })
    email: string;
    @Column({ enum: UserRoleEnum})
    role: string;
    @Column()
    password: string;
    @Column()
    salt: string;
    @Column({ default: true })
    IsActive: boolean;
    @Column({ default: true })
    IsPublic: boolean;
    @Column({ default: false })
    IsDeleted: boolean;
    @Column({ nullable: true })
    description: string;
    @Column()
    deletedAt: Date;
    @Column()
    CreatedAt: Date;
    @Column()
    updatedAt: Date;
    @Column({ default: 10 })
    coins: number;
    @OneToMany(() => ChallengeEntity, (challenge) => challenge.creator, { eager: true, cascade: true })
    challenges: ChallengeEntity[];
}
