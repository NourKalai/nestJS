import { IsEmail, IsNotEmpty, isString, MinLength } from "class-validator";

export class UserRegisterDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    @MinLength(3)
    password: string
}