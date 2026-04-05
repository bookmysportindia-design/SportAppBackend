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
      const teams = await TeamService.getTeams();
      res.json(teams);
    } catch (error) {
      next(error);
    }
  }
}
