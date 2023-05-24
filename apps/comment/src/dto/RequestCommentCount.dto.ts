import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestCommentCountDto {
    @ApiProperty()
    @IsString()
    post_id: string;
}