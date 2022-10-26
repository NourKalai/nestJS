import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class AddUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsString()
    role: string;
    @IsNotEmpty()
    @MinLength(4, { message: `taille minimale du champ name est de 3 caractères` })
    password: string;
    @IsOptional()
    description: string;

}