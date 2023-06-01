import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CATEGORY } from './Categories';
import { ROLE } from './Roles';

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
  category!: CATEGORY[];

  @Column('varchar')
  role!: ROLE;

  @CreateDateColumn()
  created_at!: Date;

  @Column('varchar')
  message: string;
}
