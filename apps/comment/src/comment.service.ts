import { Body, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) { }
  getHello(): string {
    return 'Hi hello';
  }

  // post의 모든 댓글 불러오기
  async loadAllComments(post_id: string) {
    // 게시글이 존재하는 건지 확인
    // const isExistedPost;

    // // 게시글이 없을 때
    // if (isExistedPost == null) {
    //   return '없는 게시글입니다.';
    // }

    const comments = this.commentRepository
      .createQueryBuilder('comment')
      .select('comment_id')
      .addSelect('user_id')
      .addSelect('content')
      .addSelect('created_at')
      .leftJoin('comment.post_id', 'post_id')
      .where('comment.post_id = :post_id', { post_id })
      .getMany();

    return comments; // 이러면되나?
  }

  // post에 달린 댓글 개수
  async getCommentsCount(post_id: string) {
    const count = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.post_id = :post_id', { post_id })
      .getCount();

    return count;
  }

  // 새 댓글 추가
  async addComment(content: string) {
    const comment = this.commentRepository.create({
      content: content,
    });
    return await this.commentRepository.insert(comment);
  }

  // 댓글 수정
  async updateComment(comment_id: string, content: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        comment_id,
      },
    });

    // 댓글이 없으면
    if (comment == null) {
      return '없는 댓글입니다.';
    }

    comment.content = content;

    return await this.commentRepository.save(comment);
  }

  // 댓글 삭제
  async deleteComment(comment_id: string) {
    return await this.commentRepository.delete({
      comment_id,
    });
  }
}
