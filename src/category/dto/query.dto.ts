import { ApiPropertyOptional, } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CommonQueryDto } from "../../auth/common/dto/query.dto";
import { Transform } from "class-transformer";


export class CategoryQueryDto extends CommonQueryDto {
    @ApiPropertyOptional()
    @Transform(({ value }) => (value === 'null' || value === "" ? null : Number(value)))
    @IsOptional()
    @IsNumber()
    parentId: number = null
}