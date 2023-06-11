import { IsEmail, IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CATEGORY } from '@app/common/enums/category.enum';
import { Role } from '@app/common/enums/role.enum';

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
  role!: Role;

  @CreateDateColumn()
  created_at!: Date;

  @Column('varchar')
  message: string;
}
