import { Request,Response,NextFunction } from "express";
import { NotificationService } from "./notification_service.js";

export class NotificationController {
  static async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try{
        const userId = req.user?.userId;
        if (!userId) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }
        const notifications = await NotificationService.getNotifications(userId);
        res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  static async createNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { title, message } = req.body;
      const notification = await NotificationService.createNotification(
        userId,
        title,
        message
      );
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  }

}
