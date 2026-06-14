import type { Request, Response, NextFunction } from "express";
import { TeamService } from "./team.service.js";

export class TeamController {
  static async createTeam(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const data = req.body;
    try {
      const team = await TeamService.createTeam(userId, data);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const data = req.body;
    try {
      await TeamService.addMember(userId, data);
      res.json({ message: "Member added" });
    } catch (error) {
      next(error);
    }
  }

  static async getTeams(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;
      const teams = await TeamService.getTeams(search || undefined);
      res.json(teams);
    } catch (error) {
      next(error);
    }
  }

  static async getMyTeams(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;
      const teams = await TeamService.getMyTeams(userId, search || undefined);
      res.json(teams);
    } catch (error) {
      next(error);
    }
  }

  static async sendInvite(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const invite = await TeamService.sendInvite(userId, req.body);
      res.json(invite);
    } catch (error) {
      next(error);
    }
  }

  static async requestJoin(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const invite = await TeamService.requestJoin(userId, req.body);
      res.json(invite);
    } catch (error) {
      next(error);
    }
  }

  static async respondToInvite(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const result = await TeamService.respondToInvite(userId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMyInvites(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const invites = await TeamService.getMyInvites(userId);
      res.json(invites);
    } catch (error) {
      next(error);
    }
  }

  static async getTeamInvites(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { teamId } = req.params;
    if (typeof teamId !== "string") {
      res.status(400).json({ message: "Team ID is required" });
      return;
    }
    try {
      const invites = await TeamService.getTeamInvites(userId, teamId);
      res.json(invites);
    } catch (error) {
      next(error);
    }
  }

  static async leaveTeam(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { teamId } = req.params;
    if (typeof teamId !== "string") {
      res.status(400).json({ message: "Team ID is required" });
      return;
    }
    try {
      const result = await TeamService.leaveTeam(userId, teamId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async removePlayer(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      const result = await TeamService.removePlayer(userId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
