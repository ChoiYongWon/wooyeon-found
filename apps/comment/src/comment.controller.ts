import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { Role } from '@app/common/enums/role.enum';
import SnsService from '@app/sns/sns.service';
import { RequestCreateCommentDto } from './dto/RequestCreateComment.dto';
import { RequestUpdateCommentDto } from './dto/RequestUpdateComment.dto';
import { RequestDeleteCommentDto } from './dto/RequestDeleteComment.dto';
import { RequestCommentCountDto } from './dto/RequestCommentCount.dto';

@Controller('/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/comment/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get()
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  // 모든 댓글 불러오기 (게시글 눌렀을 때)
  async loadAllComments(@Req() req) {
    return await this.commentService.loadAllComments(req.post_id);
  }

  // @Get('/count')
  // @Roles([Role.User])
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // // post의 댓글 개수 가져오기
  // async commentsCount(@Query() query: RequestCommentCountDto) {
  //   return await this.commentService.getCommentsCount(query);
  // }

  @Post()
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  // 댓글 추가
  async addComment(@Body() body: RequestCreateCommentDto, user_id: string) {
    return await this.commentService.addComment(body, user_id);
  }

  // @Patch()
  // @Roles([Role.User])
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  // // 댓글 수정
  // async updateComment(@Body() body: RequestUpdateCommentDto, user_id: string) {
  //   return await this.commentService.updateComment(body, user_id);
  // }

  @Delete()
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  // 댓글 삭제
  async deleteComment(@Body() body: RequestDeleteCommentDto) {
    return await this.commentService.deleteComment(body.comment_id);
  }
}
