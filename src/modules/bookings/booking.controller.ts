import type { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service.js";
import {
  createBookingSchema,
  getUserBookingsQuerySchema,
  cancelBookingSchema,
  acceptBookingSchema,
} from "./booking.schema.js";

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

      const data = createBookingSchema.parse(req.body);
      const booking = await BookingService.create(userId, data);
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

      const query = getUserBookingsQuerySchema.parse(req.query);
      const bookings = await BookingService.getUserBookings(userId, query);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }

  static async getBookingRequests(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const bookingRequests =
        await BookingService.getBusinessBookingRequests(userId);
      res.status(200).json(bookingRequests);
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

      const data = cancelBookingSchema.parse(req.body);
      const booking = await BookingService.cancel(userId, data);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async acceptBookingRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const data = acceptBookingSchema.parse(req.body);
      const booking = await BookingService.acceptBookingRequest(data);
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }
}
