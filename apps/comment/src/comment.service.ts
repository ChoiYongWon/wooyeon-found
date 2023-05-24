import { Body, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { RequestCreateCommentDto } from './dto/RequestCreateComment.dto';
import { RequestUpdateCommentDto } from './dto/RequestUpdateComment.dto';
import { RequestCommentCountDto } from './dto/RequestCommentCount.dto';
import SnsService from '@app/sns/sns.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly snsService: SnsService,

  ) { }
  getHello(): string {
    return 'Hi hello';
  }

  // post에 달린 댓글 개수
  async getCommentsCount(comment: RequestCommentCountDto) {
    const count = this.commentRepository
      .createQueryBuilder('comment')
      .where(`comment.post_id = ${comment.post_id}`)
      .getCount();

    return count;
  }

  // post의 모든 댓글 불러오기
  async loadAllComments(post_id: string) {
    // 게시글이 존재하는 건지 확인
    // const isExistedPost;

    // // 게시글이 없을 때
    // if (isExistedPost == null) {
    //   return '없는 게시글입니다.';
    // }

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .select('comment.comment_id')
      .addSelect('comment.user_id')
      .addSelect('comment.content')
      .addSelect('comment.created_at')
      .leftJoin('comment.post_id', 'post_id')
      .where('comment.post_id = :post_id', { post_id })
      .getMany();

    return comments;
  }

  // 로그인한 유저가 클릭한 post에 쓴 댓글을 확인
  async checkUser(user_id: string, post_id: string) {
    // 내가 쓴 댓글의 commentID 찾음
    const myComments = await this.commentRepository
      .createQueryBuilder('comment')
      .select('comment_id')
      .where('user_id = :user_id', { user_id })
      .andWhere('post_id = :post_id', { post_id })
      .getMany();

    return myComments;
  }

  // 새 댓글 추가
  async addComment(body: RequestCreateCommentDto, user_id: string) {
    //const isExistedPost;

    const comment = this.commentRepository.create({
      post_id: body.post_id,
      user_id: user_id,
      content: body.content,
    });
    return await this.commentRepository.insert(comment);
  }

  // 댓글 수정
  async updateComment(body: RequestUpdateCommentDto, user_id: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        comment_id: body.comment_id,
        user_id: user_id,
      },
    });

    // 댓글이 없으면
    if (comment == null) {
      return '없는 댓글입니다.';
    }

    comment.content = body.content;

    return await this.commentRepository.save(comment);
  }

  // 댓글 삭제
  async deleteComment(comment_id: string) {
    const { post_id } = await this.commentRepository.findOneBy({ comment_id });
    if (!post_id) {
      return '없는 게시글입니다';
    }

    await this.commentRepository.delete({
      comment_id,
    });
    await this.snsService.publishMessage(post_id, 'comment_deleted');
  }
}
