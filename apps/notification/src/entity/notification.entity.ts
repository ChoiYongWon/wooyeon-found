import { NOTIFICATION } from '@app/common/enums/notification.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notification_id!: string;

  @Column('uuid')
  target_id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('varchar')
  type!: NOTIFICATION;

  @Column('varchar')
  content!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  viewed!: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  hidden!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
