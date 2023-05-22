import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestDeleteCommentDto {
    @ApiProperty()
    comment_id: string;
}