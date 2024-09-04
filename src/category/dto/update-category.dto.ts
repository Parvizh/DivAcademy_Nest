import { ApiProperty, } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoryEntity } from "../category.entity";


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

    parents:CategoryEntity[]

}