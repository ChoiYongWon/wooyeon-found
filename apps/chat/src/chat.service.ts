import SnsService from '@app/sns/sns.service';
import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { v4 as uuid } from 'uuid';
import { RequestReadChatDto } from './dto/request/ReadChat.dto';
import { RequestCreateChatDto } from './dto/request/CreateChat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PostServiceDownException } from '../exception/PostServiceDown.exception';
import { MessageDTO } from '@app/common/dto/Message.dto';

@Injectable()
export class ChatService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly snsService: SnsService,
    private readonly httpService: HttpService,
  ) {}

  async getChat(data: RequestReadChatDto, user_id: string) {
    const chat = await this.chatRepository.find({
      where: {
        group_id: data.group_id,
      },
      order: {
        created_at: 'ASC',
      },
    });
    const res = chat.map((chat) => ({
      chat_id: chat.chat_id,
      is_own: chat.src_user_id == user_id,
      content: chat.content,
      created_at: chat.created_at,
    }));
    return res;
  }

  async createChat(info: RequestCreateChatDto, user_id: string) {
    let newChat;
    let dest_user_id;
    const src_user_id = user_id;
    let group_id;

    const currentChat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('src_user_id = :src_user_id', { src_user_id: user_id })
      .orWhere('dest_user_id = :dest_user_id', { dest_user_id: user_id })
      .getOne();

    if (currentChat) {
      group_id = currentChat.group_id;
      dest_user_id =
        currentChat.dest_user_id == user_id
          ? currentChat.src_user_id
          : currentChat.dest_user_id;

      newChat = await this.chatRepository.create({
        group_id: currentChat.group_id,
        src_user_id: user_id,
        dest_user_id: dest_user_id,
        post_id: info.post_id,
        content: info.content,
      });
    } else {
      group_id = uuid();

      const { data } = await firstValueFrom(
        this.httpService.get(
          `https://api.wooyeons.site/post/author?post_id=${info.post_id}`,
        ),
      ).catch(() => {
        throw new PostServiceDownException();
      });

      dest_user_id = data.user_id;

      newChat = await this.chatRepository.create({
        group_id: group_id,
        src_user_id: user_id,
        dest_user_id: dest_user_id,
        post_id: info.post_id,
        content: info.content,
      });
    }
    await this.chatRepository.save(newChat);
    const message: MessageDTO = {
      user_id: dest_user_id,
      target_id: group_id,
      content: info.content,
    };
    await this.snsService.publishMessage(message, 'chat');
  }

  async getAllGroup(user_id: string) {
    const subQuery = this.chatRepository
      .createQueryBuilder('chat')
      .subQuery()
      .select('MAX(c.created_at)')
      .from(Chat, 'c')
      .where('c.group_id = chat.group_id')
      .andWhere(
        new Brackets((qb) => {
          qb.where(`c.dest_user_id = '${user_id}'`).orWhere(
            `c.src_user_id = '${user_id}'`,
          );
        }),
      )
      .getQuery();

    const recentChats = await this.chatRepository
      .createQueryBuilder('chat')
      .select('chat.group_id', 'group_id')
      .addSelect('chat.content', 'recent_chat')
      .where(`chat.created_at = (${subQuery})`)
      .getRawMany();

    return recentChats;
  }
}
