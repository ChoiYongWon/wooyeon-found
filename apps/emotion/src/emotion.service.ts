import SnsService from '@app/sns/sns.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emotion } from './entity/emotion.entity';
import { RequestCreateEmotionDto } from './dto/request/CreateEmotion.dto';
import { RequestIsEmotionCheckedDto } from './dto/request/IsEmotionChecked.dto';
import { EmotionDuplicatedException } from './exception/EmotionDuplicated.exception';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PostServiceDownException } from './exception/PostServiceDown.exception';
import { MessageDTO } from '@app/common/dto/Message.dto';

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,
    private readonly httpService: HttpService,
    private readonly snsService: SnsService,
  ) {}

  // 새 댓글 추가
  async addEmotion(body: RequestCreateEmotionDto, user_id: string) {
    //const isExistedPost;
    const isExist = await this.emotionRepository.exist({
      where: {
        post_id: body.post_id,
        user_id: user_id,
      },
    });

    if (isExist) {
      throw new EmotionDuplicatedException();
    }

    const { data: target_user_id } = await firstValueFrom(
      this.httpService.get(
        `http://post:80/post/author?post_id=${body.post_id}`,
      ),
    ).catch(() => {
      throw new PostServiceDownException();
    });

    const message: MessageDTO = {
      user_id: target_user_id?.user_id,
      target_id: body.post_id,
      content: '',
    };

    const emotion = this.emotionRepository.create({
      post_id: body.post_id,
      user_id: user_id,
    });
    const res = await this.emotionRepository.save(emotion);
    await this.snsService.publishMessage(message, 'emotion_created');
    return res;
  }

  // 새 댓글 추가
  async emotionChecked(body: RequestIsEmotionCheckedDto, user_id: string) {
    return await this.emotionRepository.exist({
      where: {
        post_id: body.post_id,
        user_id: user_id,
      },
    });
  }

  // 댓글 삭제
  async deleteEmotion(post_id: string, user_id: string) {
    const { data: target_user_id } = await firstValueFrom(
      this.httpService.get(`http://post:80/post/author?post_id=${post_id}`),
    ).catch(() => {
      throw new PostServiceDownException();
    });

    const message: MessageDTO = {
      user_id: target_user_id?.user_id,
      target_id: post_id,
      content: '',
    };

    await this.emotionRepository.delete({
      post_id,
      user_id,
    });
    await this.snsService.publishMessage(message, 'emotion_deleted');
  }

  // 댓글 삭제
  async deleteEmotionByPostId(post_id: string) {
    await this.emotionRepository
      .createQueryBuilder('emotion')
      .delete()
      .from(Emotion)
      .where('post_id = :post_id', { post_id })
      .execute();
  }

  // 댓글 삭제
  async deleteEmotionByUserId(user_id: string) {
    await this.emotionRepository
      .createQueryBuilder('emotion')
      .delete()
      .from(Emotion)
      .where('user_id = :user_id', { user_id })
      .execute();
  }
}
