import { Injectable, Logger } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestCreatePostDto } from './dto/request/CreatePost.dto';
import { RequestDeletePostDto } from './dto/request/DeletePost.dto';
import SnsService from '@app/sns/sns.service';
import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Image } from './entity/image.entity';
import { PostUploadFailException } from './exception/PostUploadFail.exception';
import { RequestReadNearPostDto } from './dto/request/ReadNearPost.dto';
import { RequestReadIsPostViewedDto } from './dto/request/ReadIsPostViewed.dto';
import { View } from './entity/view.entity';
import { RequestReadPostDto } from './dto/request/ReadPost.dto';
import { RequestReadViewedPostByMonthDto } from './dto/request/ReadViewedPostByMonth.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PostService {
  s3Client: S3Client;

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(View)
    private viewRepository: Repository<View>,

    private readonly snsService: SnsService,
    private readonly httpService: HttpService,
  ) {
    this.s3Client = new S3Client({
      region: 'ap-northeast-2',
    });
  }

  async createPost(
    post: RequestCreatePostDto,
    user_id: string,
    files: Express.Multer.File[],
  ) {
    //User가 존재하는지 검증하는 과정 필요
    const images = [];

    //모든 사진 s3에 등록
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        return new Promise(async (res, rej) => {
          const newFileName = `${uuidv4()}.${
            file.originalname.split('.').reverse()[0]
          }`;

          const param = {
            Bucket: process.env.S3_BUCKET_NAME,
            Body: file.buffer,
            Key: `${newFileName}`,
          };

          const command = new PutObjectCommand(param);
          const response = await this.s3Client.send(command);

          if (response.$metadata.httpStatusCode == 200) {
            // 업로드 성공시 Image DB에 등록
            const image = new Image();
            image.img_url = `${process.env.S3_URL}/${newFileName}`;
            image.img_name = `${newFileName}`;
            images.push(image);
          }

          res(true);
        });
      }),
    );

    //업로드 실패시 업로드 한 이미지 삭제
    if (images.length != files.length) {
      const param = {
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
          Objects: images.map((image) => ({
            Key: image.img_name,
          })),
          Quiet: true,
        },
      };
      const command = new DeleteObjectsCommand(param);
      await this.s3Client.send(command);
      throw new PostUploadFailException();
    }

    //우연 정보 db에 저장
    const newPost = await this.postRepository.create({
      ...post,
      image: images,
      user_id,
    });
    const res = await this.postRepository.save(newPost);
    return res;
  }

  async increaseComment(post_id: string) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ comment_count: () => 'comment_count + 1' })
      .where('post_id = :post_id', { post_id })
      .execute();
  }

  async decreaseComment(post_id: string) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ comment_count: () => 'comment_count - 1' })
      .where('post_id = :post_id', { post_id })
      .execute();
  }

  async increaseEmotion(post_id: string) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ emotion_count: () => 'emotion_count + 1' })
      .where('post_id = :post_id', { post_id })
      .execute();
  }

  async decreaseEmotion(post_id: string) {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ emotion_count: () => 'emotion_count - 1' })
      .where('post_id = :post_id', { post_id })
      .execute();
  }

  async deleteAllPostByUser(user_id: string) {
    const current_post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .addSelect('image.img_url')
      .where('user_id = :user_id', { user_id })
      .getMany();

    const param = {
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: current_post
          .map((post) =>
            post.image.map((image) => ({
              Key: image.img_name,
            })),
          )
          .reduce((acc, cur) => [...acc, ...cur], []),
        Quiet: true,
      },
    };
    const command = new DeleteObjectsCommand(param);
    await this.s3Client.send(command);
    await this.postRepository.delete({ user_id });
  }

  async readNearPost(post: RequestReadNearPostDto) {
    const near_post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .select('post.post_id')
      .addSelect('post.created_at')
      .addSelect('image.img_url')
      .addSelect(
        `6371 * acos(cos(radians(${post.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${post.longitude})) + sin(radians(${post.latitude})) * sin(radians(latitude)))`,
        'distance',
      )
      .having(`distance <= ${0.1}`) //100 미터 이내 모든 우연
      .getMany();
    return near_post;
  }

  async readNearPostExceptViewed(
    post: RequestReadNearPostDto,
    user_id: string,
  ) {
    // const { data } = await firstValueFrom(
    //   this.httpService.get(`http://api.wooyeons.site/user/search?${user_id}`),
    //   // .pipe(catchError(() => ({ data: null }))),
    // ).catch(() => null);
    // console.log(`axios result : ${data}`);

    const near_post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .leftJoinAndSelect('post.view', 'view')
      .where('view.user_id is NULL')
      .select('post.post_id')
      .addSelect('post.created_at')
      .addSelect('image.img_url')
      .addSelect(
        `6371 * acos(cos(radians(${post.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${post.longitude})) + sin(radians(${post.latitude})) * sin(radians(latitude)))`,
        'distance',
      )
      .having(`distance <= ${0.1}`) //100 미터 이내 모든 우연
      .getMany();
    return near_post;
  }

  async readViewedPostByMonth(
    data: RequestReadViewedPostByMonthDto,
    user_id: string,
  ) {
    const near_post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .leftJoinAndSelect('post.view', 'view')
      .where('view.user_id = :user_id', { user_id })
      .andWhere('post.created_at >= :startDate', {
        startDate: new Date(data.year, data.month - 1),
      })
      .andWhere('post.created_at < :endDate', {
        endDate: new Date(data.year, data.month),
      })
      .distinctOn(['view.user_id'])
      .select('post.post_id')
      .addSelect('post.created_at')
      .addSelect('image.img_url')
      .addSelect('post.latitude')
      .addSelect('post.longitude')
      .getMany();
    return near_post;
  }

  async readPost(post: RequestReadPostDto, user_id: string) {
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .loadRelationCountAndMap('post.viewCount', 'post.view')
      .where('post_id = :post_id', { post_id: post.post_id })
      .getOne();
    if (result.user_id != user_id) {
      //우연 작성자랑 조회자가 일치하지않을때
      const view = await this.viewRepository.create({
        user_id,
        post: result,
      });
      await this.viewRepository.save(view);
    }

    return result;
  }

  async deletePost(post: RequestDeletePostDto, user_id: string) {
    //User가  존재하는지 검증하는 과정 필요

    const current_post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.image', 'image')
      .addSelect('image.img_url')
      .getOne();

    const param = {
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: current_post.image.map((image) => ({
          Key: image.img_name,
        })),
        Quiet: true,
      },
    };
    const command = new DeleteObjectsCommand(param);
    await this.s3Client.send(command);
    const res = await this.postRepository.delete({ post_id: post.post_id });
    await this.snsService.publishMessage(post.post_id, 'post_deleted');
    return res;
  }

  async isPostViewed({ user_id, post_id }: RequestReadIsPostViewedDto) {
    return await this.viewRepository
      .createQueryBuilder('view')
      .leftJoin('view.post', 'post')
      .where('user_id = :user_id', { user_id })
      .andWhere('post.post_id = :userpost_id_id', { post_id })
      .getExists();
  }
}
