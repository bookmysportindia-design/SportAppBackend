import { Router } from "express";
import { MatchController } from "./match.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { createMatchSchema, getMatchesQuerySchema } from "./match.schema.js";
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

// Get specific match by ID
router.get("/:id", (req, res) => {
  res.send(`Get match with id ${req.params.id}`);
});

export default router;
