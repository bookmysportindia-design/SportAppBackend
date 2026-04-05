import e, { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { TeamController } from "./team.controller.js";

const router = Router();

router.post("/create-team", authMiddleware, TeamController.createTeam);

router.post("/update-team", authMiddleware, (req, res) => {
  res.send("Update team");
});

router.post("/add-member", authMiddleware, TeamController.addMember);

router.get("/get-teams", authMiddleware, TeamController.getTeams);

router.get("/get-team/:id", authMiddleware, (req, res) => {
  res.send("Get team by id");
});

router.delete("/delete-team/:id", authMiddleware, (req, res) => {
  res.send("Delete team by id");
});

export default router;
