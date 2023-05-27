import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Image } from './image.entity';
import { Post } from './post.entity';

@Entity()
export class View {
  @PrimaryGeneratedColumn('uuid')
  view_id!: string;

  @Column('uuid')
  user_id!: string;

  @ManyToOne(() => Post, (post) => post.view, {
    onDelete: 'CASCADE',
  })
  post!: Post;

  @CreateDateColumn()
  created_at!: Date;
}
