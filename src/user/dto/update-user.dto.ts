import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name: string;
    @IsOptional()
    @IsString()
    mail: string;
    @IsOptional()
    @IsString()
    userTypeId: string;
    @IsOptional()
    @MinLength(4, { message: `taille minimale du champ name est de 3 caractères` })
    password: string;
    @IsOptional()
    description: string;

}