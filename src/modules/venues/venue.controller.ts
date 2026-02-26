import type { Request, Response, NextFunction } from "express";
import { VenueService } from "./venue.service";

export class VenueController {
  static async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const venues = await VenueService.list(req.query);
      res.status(200).json(venues);
    } catch (error) {
      next(error);
    }
  }
}
