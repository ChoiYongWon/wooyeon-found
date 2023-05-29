import SnsService from '@app/sns/sns.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emotion } from './entity/emotion.entity';
import { RequestCreateEmotionDto } from './dto/request/CreateEmotion.dto';
import { RequestIsEmotionCheckedDto } from './dto/request/IsEmotionChecked.dto';
import { EmotionDuplicatedException } from './exception/EmotionDuplicated.exception';

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,
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

    const emotion = this.emotionRepository.create({
      post_id: body.post_id,
      user_id: user_id,
    });
    await this.emotionRepository.insert(emotion);
    await this.snsService.publishMessage(body.post_id, 'emotion_created');
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
    await this.emotionRepository.delete({
      post_id,
      user_id,
    });
    await this.snsService.publishMessage(post_id, 'emotion_deleted');
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
