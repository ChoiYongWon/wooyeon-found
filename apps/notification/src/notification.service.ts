import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { Repository } from 'typeorm';
import { RequestUpdateHiddenDto } from './dto/request/UpdateHidden.dto';
import { RequestCreateNotificationDto } from './dto/request/CreateNotification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(data: RequestCreateNotificationDto) {
    const newNotification = await this.notificationRepository.create({
      ...data,
    });
    return await this.notificationRepository.save(newNotification);
  }

  async readOwnNotification(user_id: string) {
    return await this.notificationRepository
      .createQueryBuilder('notification')
      .where('user_id = :user_id', { user_id })
      .andWhere('hidden = false')
      .getMany();
  }

  async readOwnNotificationCount(user_id: string) {
    const count = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('user_id = :user_id', { user_id })
      .andWhere('hidden = false')
      .getCount();
    return {
      count,
    };
  }

  async updateHidden(user_id: string, data: RequestUpdateHiddenDto) {
    return await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({
        hidden: true,
      })
      .where('notification_id = :notification_id', {
        notification_id: data.notification_id,
      })
      .andWhere('user_id = :user_id', { user_id })
      .execute();
  }

  async updateView(user_id: string, data: RequestUpdateHiddenDto) {
    return await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({
        viewed: true,
      })
      .where('notification_id = :notification_id', {
        notification_id: data.notification_id,
      })
      .andWhere('user_id = :user_id', { user_id })
      .execute();
  }
}
