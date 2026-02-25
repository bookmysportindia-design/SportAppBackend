import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { SendOtpDto, VerifyOtpDto } from "./auth.types";

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
}
