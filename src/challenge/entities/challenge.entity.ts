import { UserEntity } from "src/user/entities/user.entity";
import { TimestampEntities } from "src/user/generics/timestamp.entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity('challenge')
export class ChallengeEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: "name", length: 20, nullable: false })
    name: string;
    @Column({ name: "description", length: 20, nullable: false })
    description: string;
    @ManyToOne(()=> UserEntity, user=> user.challenges)
    creator: UserEntity;
}
