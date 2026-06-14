import e, { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { TeamController } from "./team.controller.js";

const router = Router();

// Create a new team (caller becomes captain)
router.post("/create-team", authMiddleware, TeamController.createTeam);

// Update team details (placeholder)
router.post("/update-team", authMiddleware, (req, res) => {
  res.send("Update team");
});

// Captain directly adds a player to the team (no invite flow)
router.post("/add-member", authMiddleware, TeamController.addMember);

// Browse all teams (public, supports ?search=)
router.get("/get-teams", authMiddleware, TeamController.getTeams);

// Get teams the authenticated user belongs to (supports ?search=)
router.get("/my-teams", authMiddleware, TeamController.getMyTeams);

// Captain sends an invite to a player
router.post("/send-invite", authMiddleware, TeamController.sendInvite);

// Player requests to join a team
router.post("/request-join", authMiddleware, TeamController.requestJoin);

// Accept or decline a pending invite / join request
router.post("/respond-invite", authMiddleware, TeamController.respondToInvite);

// Player leaves a team they are a member of (captain cannot use this)
router.post("/:teamId/leave", authMiddleware, TeamController.leaveTeam);

// Captain removes a player from the team — body: { teamId, playerId }
router.post("/remove-player", authMiddleware, TeamController.removePlayer);

// Get all pending invites/join-requests for the authenticated user
router.get("/my-invites", authMiddleware, TeamController.getMyInvites);

// Captain views all invites and join-requests for their team
router.get("/:teamId/invites", authMiddleware, TeamController.getTeamInvites);

// Get a single team by ID (placeholder)
router.get("/get-team/:id", authMiddleware, (req, res) => {
  res.send("Get team by id");
});

// Delete a team by ID (placeholder)
router.delete("/delete-team/:id", authMiddleware, (req, res) => {
  res.send("Delete team by id");
});

export default router;
