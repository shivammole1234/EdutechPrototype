import { Notification } from '@/types';
import { INITIAL_NOTIFICATIONS } from './mockData';

class NotificationService {
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];

  async getNotifications(role?: string): Promise<Notification[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (role) {
      return this.notifications.filter((n) => n.role === role || n.role === 'ALL');
    }
    return [...this.notifications];
  }

  async markAsRead(id: string): Promise<void> {
    const n = this.notifications.find((item) => item.id === id);
    if (n) n.read = true;
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.read = true));
  }

  async sendBroadcast(data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    const newNotif: Notification = {
      ...data,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
