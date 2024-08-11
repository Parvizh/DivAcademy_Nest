import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { LoginDto } from "./login.dto";

export class SignUpDto extends LoginDto {
    @ApiProperty({ default: "David" })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({ default: "Davidov" })
    @IsNotEmpty()
    @IsString()
    surname: string

    @ApiPropertyOptional({ default: 12 })
    @IsOptional()
    @IsNumber()
    age: number

}