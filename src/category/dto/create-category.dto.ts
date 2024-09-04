import { ApiProperty, ApiPropertyOptional, } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoryEntity } from "../category.entity";


export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    rate: number

    @ApiProperty()
    @IsOptional()
    @IsArray()
    parentIds: number[]

    parents: CategoryEntity[] = [];
}