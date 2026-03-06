import { Request, Response, NextFunction } from "express";
import { ca } from "zod/locales";
import { PaymentService } from "./payment.service";
import { createOrderDto } from "./payment.types";

export class PaymentController {
  static async initiatePayment(
    req: Request<{}, {}, createOrderDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const orderTokenResponse = await PaymentService.createPhonePeOrderToken(req.body);
    try {
      res.json(orderTokenResponse);
    } catch (error) {
      next(error);
    }
  }
}
