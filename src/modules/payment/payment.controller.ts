import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service.js";
import { createOrderDto, getPaymentStatusDto } from "./payment.types.js";

export class PaymentController {
  static async initiatePayment(
    req: Request<{}, {}, createOrderDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const orderTokenResponse = await PaymentService.createPhonePeOrderToken(
      req.body,
    );
    try {
      res.json(orderTokenResponse);
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentStatus(
    req: Request<{}, {}, getPaymentStatusDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { orderId } = req.body;
      const paymentStatus = await PaymentService.getPaymentStatus(orderId);
      res.json({ orderId, status: paymentStatus });
    } catch (error) {
      next(error);
    }
  }
}
