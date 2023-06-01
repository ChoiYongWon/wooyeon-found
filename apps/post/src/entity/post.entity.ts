import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  RelationCount,
} from 'typeorm';
import { Image } from './image.entity';
import { View } from './view.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  post_id!: string;

  @Column('varchar')
  user_id!: string;

  @Column('varchar')
  content!: string;

  @Column('varchar')
  category!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column('double')
  latitude!: number;

  @Column('double')
  longitude!: number;

  @OneToMany(() => Image, (image) => image.post_id, {
    cascade: true,
  })
  image: Image[];

  @OneToMany(() => View, (view) => view.post, {
    cascade: true,
  })
  view: View[];

  @Column({
    type: 'int',
    default: 0,
  })
  comment_count: number;

  @Column({
    type: 'int',
    default: 0,
  })
  emotion_count: number;
}
