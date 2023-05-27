import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestUpdateCommentDto {
    @ApiProperty()
    @IsString()
    comment_id: string;

    @ApiProperty()
    @IsString()
    post_id: string;

    @ApiProperty()
    @IsString()
    content: string;
}