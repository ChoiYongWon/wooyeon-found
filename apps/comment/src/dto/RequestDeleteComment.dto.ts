import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestDeleteCommentDto {
    @ApiProperty()
    @IsString()
    comment_id: string;
}