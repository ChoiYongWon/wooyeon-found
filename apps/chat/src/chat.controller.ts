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
import { ChatService } from './chat.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { ResponseReadChatDto } from './dto/response/ReadChat.dto';
import { RequestReadChatDto } from './dto/request/ReadChat.dto';
import { RequestCreateChatDto } from './dto/request/CreateChat.dto';
import { ResponseReadGroupListDto } from './dto/response/ReadGroupList.dto';

@Controller('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/')
  @ApiOperation({
    summary: '채팅을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseReadChatDto,
    isArray: true,
  })
  async getChat(@Req() req, @Query() query: RequestReadChatDto) {
    const user_id = req.user.user_id;
    return await this.chatService.getChat(query, user_id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/')
  @ApiOperation({
    summary:
      '채팅을 생성합니다. 채팅방이 없으면 채팅방을 생성하고 채팅을 생성합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    isArray: true,
  })
  async addChat(@Req() req, @Body() body: RequestCreateChatDto) {
    const user_id = req.user.user_id;
    return await this.chatService.createChat(body, user_id);
  }
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/list')
  @ApiOperation({
    summary: '자신이 속한 모든 채팅방과 최근 채팅을 반환합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseReadGroupListDto,
    isArray: true,
  })
  async getAllGroup(@Req() req) {
    const user_id = req.user.user_id;
    return await this.chatService.getAllGroup(user_id);
  }
}
