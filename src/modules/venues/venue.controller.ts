import type { Request, Response, NextFunction } from "express";
import { VenueService } from "./venue.service";

export class VenueController {
  static async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("User:", req);
      const userId = req.user?.userId;
      console.log("User ID from request:", userId);
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const venues = await VenueService.list(req.query);
      res.status(200).json(venues);
    } catch (error) {
      next(error);
    }
  }

  static async getMyVenues(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;
      console.log("User ID from request:", userId);
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const venues = await VenueService.getMyVenues(userId);
      res.status(200).json(venues);
    } catch (error) {
      next(error);
    }
  }
}
