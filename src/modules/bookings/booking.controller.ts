import type { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service";

export class BookingController {
  static async create(
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

      const booking = await BookingService.create(userId, req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async getUserBookings(
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

      const { date } = req.query;

      const bookings = await BookingService.getUserBookings(
        userId,
        typeof date === "string" ? date : undefined,
      );

      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }

  static async cancel(
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

      const { bookingId } = req.body;

      const booking = await BookingService.cancel(userId, bookingId);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }
}
