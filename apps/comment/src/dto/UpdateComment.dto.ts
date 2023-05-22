import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestUpdateCommentDto {
    @ApiProperty()
    comment_id: string;

    @ApiProperty()
    content: string;
}