import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AddTodoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3,{message:`taille minimale du champ name est de 3 caractères`})
   @MaxLength(12)
    name:string;
    @IsString()
    @IsOptional()
    description:string;
    // @IsIn(['active','pending','refused'])
    // state;
}