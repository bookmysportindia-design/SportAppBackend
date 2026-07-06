import { Router } from "express";
import { MatchController } from "./match.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  createMatchSchema,
  sendMatchInviteSchema,
  requestJoinMatchSchema,
  respondToMatchInviteSchema,
} from "./match.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// All match routes require authentication
router.use(authMiddleware);

// Create a new match (requires a valid booking)
router.post("/schedule", validate(createMatchSchema), MatchController.create);

// Get all matches
router.get("/", MatchController.getAll);

// Get all matches related to the user
router.get("/user", MatchController.getMatchesForUser);

// Captain invites a player to a match
router.post("/send-invite", validate(sendMatchInviteSchema), MatchController.sendMatchInvite);

// Player requests to join a match
router.post("/request-join", validate(requestJoinMatchSchema), MatchController.requestJoinMatch);

// Accept or decline a pending match invite / join request
router.post("/respond-invite", validate(respondToMatchInviteSchema), MatchController.respondToMatchInvite);

// Get all pending match invites for the authenticated user
router.get("/my-invites", MatchController.getMyMatchInvites);

// Captain views all invites for their team in a match
router.get("/:matchId/:teamId/invites", MatchController.getMatchInvites);

// Get confirmed squad for a match
router.get("/:matchId/squad", MatchController.getMatchSquad);

// Get specific match by ID
router.get("/:id", (req, res) => {
  res.send(`Get match with id ${req.params.id}`);
});

export default router;
