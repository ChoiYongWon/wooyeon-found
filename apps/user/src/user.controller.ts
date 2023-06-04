import {
  Controller,
  Get,
  Req,
  UseGuards,
  Patch,
  Body,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth.guard';
import { RolesGuard } from '@app/common/guard/roles.guard';
import { ResponseGetUserDto } from './dto/ResponseGetUser.dto';
import { Roles } from '@app/common/decorators/roles.decorator';
import { Role } from '@app/common/enums/role.enum';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { RequestGetUserDto } from './dto/RequestGetUser.dto';
import SnsService from '@app/sns/sns.service';
import { RequestGetOneUserDto } from './dto/RequestGetOneUser.dto';
import { ResponseCreateUserDto } from './dto/ResponseCreateUser.dto';
import { RequestCreateUserDto } from './dto/RequestCreateUser.dto';
//https://api.wooyeons.site/user/api
//http://localhost/user/api // 배포 후 상태, 모든 서버에서 확인가능
//npm run start:dev user // 배포 전 상태, 내 서버에서만 확인가능

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '본인 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserDto,
  })
  @Roles([Role.User])
  @UseGuards(JwtAuthGuard)
  async getOwnUser(@Req() req) {
    return await this.userService.findOne(req.user.user_id);
  }

  @Post()
  @ApiOperation({
    summary: '유저 생성',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseCreateUserDto,
  })
  async createUser(@Body() body: RequestCreateUserDto) {
    return await this.userService.create(body);
  }

  // 수정
  @Patch()
  @ApiOperation({
    summary: '본인 정보를 수정합니다.',
  })
  @Roles([Role.User])
  @UseGuards(JwtAuthGuard)
  async patchUser(@Req() req, @Body() updateData: RequestUpdateUserDto) {
    return await this.userService.update(req.user.user_id, updateData);
  }

  // 삭제
  @Delete()
  @ApiOperation({
    summary: '본인 정보를 삭제합니다.',
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async removeUser(@Req() req) {
    return await this.userService.delete(req.user.user_id);
  }

  @Get('search')
  @ApiOperation({
    summary: '상대 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserDto,
  })
  async getUser(@Query() query: RequestGetOneUserDto) {
    const { user_id } = query;
    return await this.userService.findOne(user_id);
  }

  // 토큰이 없는 상황
  @Get('/email')
  @ApiOperation({
    summary: 'auth에서 email정보를 전송했습니다.',
  })
  //localhost/user/email?email=yongwon0824
  async sendInfo(
    @Query() query: RequestGetUserDto,
  ): Promise<ResponseGetUserDto> {
    return await this.userService.findOneByEmail(query.email);
  }

  // 토큰이 있는 상황
  @Get()
  @ApiOperation({
    summary: '토큰이 있으면 토큰에 있는 user_id를 기반으로 정보 전송',
  })
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async sendInfoByToken(@Req() req) {
    return await this.userService.findOne(req.user.user_id);
  }

  @Get('/healthcheck')
  healthCheck(): number {
    return 200;
  }
}
