import { ApiProperty,  } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ default: "david@mail.ru" })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ default: "david123" })
    @IsNotEmpty()
    @IsString()
    password: string
}