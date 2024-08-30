import { ApiProperty, } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    rate: number

    @ApiProperty()
    @IsOptional()
    @IsArray()
    parentIds: number[]

}