import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    userToId: number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text: string

    userFromId: number;
    sesssionId: number;
    hasSeen: boolean;
}