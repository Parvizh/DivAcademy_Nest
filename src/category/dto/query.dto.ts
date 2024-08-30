import { ApiProperty, } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CommonQueryDto } from "../../auth/common/dto/query.dto";


export class CategoryQueryDto extends CommonQueryDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    parentId:number

}