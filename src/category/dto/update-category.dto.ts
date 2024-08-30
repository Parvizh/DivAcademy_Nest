import { ApiProperty, } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    rate: number

    @ApiProperty()
    @IsOptional()
    @IsArray()
    parentsIds: number[]

}