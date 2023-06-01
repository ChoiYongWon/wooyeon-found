import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Emotion {
  @PrimaryGeneratedColumn('uuid')
  emotion_id!: string;

  @Column('uuid')
  post_id!: string;

  @Column('uuid')
  user_id!: string;

  @CreateDateColumn()
  created_at!: Date;
}
