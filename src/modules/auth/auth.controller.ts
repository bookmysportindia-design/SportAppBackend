import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { SendOtpDto, VerifyOtpDto } from "./auth.types.js";

export class AuthController {
  static async sendOtp(
    req: Request<{}, {}, SendOtpDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await AuthService.sendOtp(req.body);
      res.status(200).json({ message: "OTP sent" });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(
    req: Request<{}, {}, VerifyOtpDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await AuthService.verifyOtp(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getUserInfo(
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
      const userInfo = await AuthService.getUserInfo(userId);
      res.status(200).json(userInfo);
    } catch (error) {
      next(error);
    }
  }
}
