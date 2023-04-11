import { Injectable } from '@nestjs/common';
import { Post } from './entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postingRepository: Repository<Post>,
  ) {}
  getHello(): string {
    return 'Hello World Post Service Ver. 2';
  }

  async testQuery() {
    return await this.postingRepository.find();
  }

  async getPostCount() {
    return await this.postingRepository.count();
  }

  async insertPost(content: string, category: string) {
    const post = this.postingRepository.create({
      content: content,
      latitude: 38.2341,
      longitude: 128.1231,
      category: category,
    });
    return await this.postingRepository.save(post);
  }
}
