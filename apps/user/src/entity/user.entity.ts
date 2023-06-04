import { IsEmail, IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ROLE } from './Roles';
import { CATEGORY } from '@app/common/enums/category.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  @IsEmail({}, { message: 'Incorrect email' })
  email!: string;

  @Column('simple-array')
  category: CATEGORY[];

  @Column('varchar')
  role!: ROLE;

  @CreateDateColumn()
  created_at!: Date;

  @Column('varchar')
  message: string;
}
