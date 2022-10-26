import { IsNotEmpty, IsString,} from "class-validator";

export class AddChallengeDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    description: string;
}