import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
  static async getUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await UserService.getById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const updated = await UserService.update(userId, req.body);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }
}
