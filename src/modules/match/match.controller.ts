import { Request, Response, NextFunction } from "express";
import { MatchService } from "./match.service.js";
import { createMatchSchema, getMatchesQuerySchema } from "./match.schema.js";

export class MatchController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getMatchesQuerySchema.parse(req.query);
      const result = await MatchService.getMatches(undefined, query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMatchesForUser(
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

      const query = getMatchesQuerySchema.parse(req.query);
      const result = await MatchService.getMatches(userId, query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const matchData = createMatchSchema.parse(req.body);
      // Create match with validated data
      const match = await MatchService.createMatch(userId, matchData);

      res.status(201).json(match);
    } catch (error) {
      next(error);
    }
  }
}
