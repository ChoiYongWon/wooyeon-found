import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmotionService } from './emotion.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from '@app/common/decorators/roles.decorator';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { Role } from '@app/common/enums/role.enum';
import { RequestCreateEmotionDto } from './dto/request/CreateEmotion.dto';
import { RequestDeleteEmotionDto } from './dto/request/DeleteEmotion.dto';
import { ResponseIsEmotionCheckedDto } from './dto/response/IsEmotionChecked.dto';
import { RequestIsEmotionCheckedDto } from './dto/request/IsEmotionChecked.dto';

@Controller('/emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  // @Get('/emotion')
  // getHello(): string {
  //   return this.emotionService.getHello();
  // }

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @Get()
  @ApiOperation({
    summary: '해당 유저가 특정 게시물에 좋아요 유무를 반환합니다..',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseIsEmotionCheckedDto,
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async emotionChecked(@Query() query: RequestIsEmotionCheckedDto, @Req() req) {
    const user_id = req.user.user_id;
    return await this.emotionService.emotionChecked(query, user_id);
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
    summary: '하나의 감정표현을 생성합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  // 댓글 추가
  async addEmotion(@Body() body: RequestCreateEmotionDto, @Req() req) {
    const user_id = req.user.user_id;
    return await this.emotionService.addEmotion(body, user_id);
  }

  @Delete()
  @ApiOperation({
    summary: '하나의 감정표현을 삭제합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()

  // 댓글 삭제
  async deleteEmotion(@Body() body: RequestDeleteEmotionDto, @Req() req) {
    const user_id = req.user.user_id;
    return await this.emotionService.deleteEmotion(body.post_id, user_id);
  }
}
