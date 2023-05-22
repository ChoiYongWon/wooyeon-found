import { ApiProperty } from "@nestjs/swagger";

export class RequestCreateCommentDto {
    @ApiProperty()
    content: string;
}