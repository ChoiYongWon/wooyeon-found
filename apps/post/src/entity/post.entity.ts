import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  post_id!: string;

  @Column('varchar', { length: 200 })
  content: string;

  @Column('varchar')
  category: string;

  @CreateDateColumn()
  created_time!: Date;

  @Column('double')
  latitude: number;

  @Column('double')
  longitude: number;
}
