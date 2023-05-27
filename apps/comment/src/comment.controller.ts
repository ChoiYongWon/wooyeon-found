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
import { RequestLoadAllCommentsDto } from './dto/RequestLoadAllComments.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseLoadAllCommentsDto } from './dto/ResponseLoadAllComments.dto';

@Controller('/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get()
  @ApiOperation({
    summary: '우연에 작성된 모든 댓글을 오름차순으로 불러옵니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseLoadAllCommentsDto,
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  // 모든 댓글 불러오기 (게시글 눌렀을 때)
  async loadAllComments(@Query() query: RequestLoadAllCommentsDto) {
    return await this.commentService.loadAllComments(query.post_id);
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
  @ApiOperation({
    summary: '하나의 댓글을 생성합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  // 댓글 추가
  async addComment(@Body() body: RequestCreateCommentDto, @Req() req) {
    const user_id = req.user.user_id;
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
  @ApiOperation({
    summary: '하나의 댓글을 삭제합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  // 댓글 삭제
  async deleteComment(@Body() body: RequestDeleteCommentDto) {
    return await this.commentService.deleteComment(body.comment_id);
  }
}
