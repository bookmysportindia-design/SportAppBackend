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

  static async getFavoriteVenues(
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
      const venues = await VenueService.getFavoriteVenues(userId);
      res.status(200).json(venues);
    } catch (error) {
      next(error);
    }
  }

  static async getPitchSlots(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const venueId = req.params.venueId as string;
      const pitchId = req.params.pitchId as string;
      const date =
        typeof req.query.date === "string" ? req.query.date : undefined;
      const view =
        typeof req.query.view === "string" ? req.query.view : "day";

      if (!venueId || !pitchId || !date) {
        res.status(400).json({
          message: "venueId, pitchId and date query parameter are required",
        });
        return;
      }

      if (view !== "day" && view !== "week" && view !== "month") {
        res
          .status(400)
          .json({ message: "view must be one of day, week, month" });
        return;
      }

      const result = await VenueService.getPitchSlots(
        venueId,
        pitchId,
        date,
        view,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const venue = await VenueService.getById(id);
      if (!venue) {
        res.status(404).json({ message: "Venue not found" });
        return;
      }
      res.status(200).json(venue);
    } catch (error) {
      next(error);
    }
  }
}
