import { Request, Response, NextFunction } from "express";
import { MatchService } from "./match.service.js";
import {
  createMatchSchema,
  getMatchesQuerySchema,
} from "./match.schema.js";

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

  static async sendMatchInvite(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const invite = await MatchService.sendMatchInvite(userId, req.body);
      res.json(invite);
    } catch (error) {
      next(error);
    }
  }

  static async requestJoinMatch(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const invite = await MatchService.requestJoinMatch(userId, req.body);
      res.json(invite);
    } catch (error) {
      next(error);
    }
  }

  static async respondToMatchInvite(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const result = await MatchService.respondToMatchInvite(userId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMyMatchInvites(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const invites = await MatchService.getMyMatchInvites(userId);
      res.json(invites);
    } catch (error) {
      next(error);
    }
  }

  static async getMatchInvites(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const matchId = req.params.matchId as string;
    const teamId = req.params.teamId as string;
    try {
      const invites = await MatchService.getMatchInvites(userId, matchId, teamId);
      res.json(invites);
    } catch (error) {
      next(error);
    }
  }

  static async getMatchSquad(req: Request, res: Response, next: NextFunction) {
    try {
      const matchId = req.params.matchId as string;
      const squad = await MatchService.getMatchSquad(matchId);
      res.json(squad);
    } catch (error) {
      next(error);
    }
  }
}
