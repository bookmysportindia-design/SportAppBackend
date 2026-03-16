import type { Request, Response, NextFunction } from "express";
import { VenueService } from "./venue.service.js";
import { CreateVenueDto, FavoriteVenueDto } from "./venue.types.js";

export class VenueController {
  static async list(
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

  static async create(
    req: Request<{}, {}, CreateVenueDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.userId;
      console.log("User ID from request:", userId);
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const venue = await VenueService.create(userId, req.body);
      res.status(201).json(venue);
    } catch (error) {
      next(error);
    }
  }

  static async favorite(
    req: Request<{}, {}, FavoriteVenueDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.userId;
      const venueId = req.body.venueId;
      console.log("User ID from request:", userId);
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const venue = await VenueService.toggleFavorite(userId, venueId);
      if (!venue) {
        res.status(404).json({ message: "Venue not found" });
        return;
      }
      res.status(200).json(venue);
    } catch (error) {
      next(error);
    }
  }

  static async getFavoriteVenues(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const venues = await VenueService.getFavoriteVenues(userId);
      res.status(200).json(venues);
    } catch (error) {
      next(error);
    }
  }
}
