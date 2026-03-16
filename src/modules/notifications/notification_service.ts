import { prisma } from "../../lib/prisma.js";

export class NotificationService {
  static async createNotification(
    userId: string,
    title: string,
    message: string,
  ) {
    return prisma.notification.create({
      data: {
        userId: userId,
        title: title,
        message: message,
        isRead: false,
      },
    });
  }

  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
