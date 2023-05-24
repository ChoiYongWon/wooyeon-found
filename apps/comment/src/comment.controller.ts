import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';
import { Role } from '@app/common/enums/role.enum';
import SnsService from '@app/sns/sns.service';
import { RequestCreateCommentDto } from './dto/CreateComment.dto';
import { RequestUpdateCommentDto } from './dto/UpdateComment.dto';
import { RequestDeleteCommentDto } from './dto/DeleteComment.dto';


@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly snsService: SnsService,
  ) { }

  // @Get('/comment')
  // getHello(): string {
  //   return this.commentService.getHello();
  // }

  @Get('/comment/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get('/jwt')
  @Roles([Role.User])
  jwt(@Req() req) {
    const user_id: any = req.user.user_id;
    const role: any = req.user.role;

    console.log(user_id);
    console.log(role);

    return 'good';
  }

  @Get()
  async sendComment(@Req() req) {
    return await this.snsService.publishMessage(
      'comment delete message',
      'comment_deleted',
    );
  }

  @Get()
  @Roles([Role.User])
  // 모든 댓글 불러오기 (게시글 눌렀을 때)
  async loadAllComments(@Req() req) {
    return await this.commentService.loadAllComments(req.post_id);
  }

  @Get('/count')
  @Roles([Role.User])
  async commentsCount(@Query() query) {
    return await this.commentService.getCommentsCount(query.post_id);
  }

  @Post()
  @Roles([Role.User])
  // 댓글 추가
  async addComment(@Body() body: RequestCreateCommentDto, user_id: string) {
    return await this.commentService.addComment(body, user_id);
  }

  @Patch()
  @Roles([Role.User])
  // 댓글 수정
  async updateComment(@Body() body: RequestUpdateCommentDto, user_id: string) {
    return await this.commentService.updateComment(body, user_id);
  }

  @Delete()
  @Roles([Role.User])
  // 댓글 삭제
  async deleteComment(@Body() body: RequestDeleteCommentDto) {
    return await this.commentService.deleteComment(body.comment_id);
  }
}
