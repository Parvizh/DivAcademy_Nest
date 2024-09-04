import { ApiPropertyOptional, } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SORT_TYPE } from "../enums/sort.enum";
import { Transform } from "class-transformer";
import { PAGINATION_VALUES } from "src/constants/pagination.constant";


export class CommonQueryDto {

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => (value === 'null' || value === "" ? PAGINATION_VALUES.page : Number(value)))
    @IsNumber()
    page: number = PAGINATION_VALUES.page

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => (value === 'null' || value === "" ? PAGINATION_VALUES.limit : Number(value)))
    @IsNumber()
    limit: number = PAGINATION_VALUES.limit;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(SORT_TYPE)
    sort: SORT_TYPE = SORT_TYPE.DESC

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orderBy: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    searchText: string


}