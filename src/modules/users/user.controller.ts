import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";

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

  // GET /users/all?search= — matches against name or phone number
  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const callerId = req.user?.userId;
      const search = req.query.search as string | undefined;
      const users = await UserService.getAll(search ? { name: search, phone: search } : {}, callerId);
      res.status(200).json(users);
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
