import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  comment_id!: string;

  @Column('uuid')
  post_id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('varchar', { length: 100 })
  content: string;

  @CreateDateColumn()
  created_at!: Date;
}
