import { ApiProperty } from "@nestjs/swagger";

export class RequestCreateCommentDto {
    @ApiProperty()
    post_id: string;

    @ApiProperty()
    content: string;
}