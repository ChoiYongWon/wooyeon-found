import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  img_id!: string;

  @ManyToOne(() => Post, (post) => post.image, {
    onDelete: 'CASCADE',
  })
  //   @JoinColumn({ name: 'post_id', referencedColumnName: 'post_id' })
  post_id!: Post;

  @Column()
  img_url!: string;

  @Column()
  img_name!: string;
}
