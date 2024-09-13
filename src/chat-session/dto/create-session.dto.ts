import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSessionDto {
    userFromId: number

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userToId: number
}