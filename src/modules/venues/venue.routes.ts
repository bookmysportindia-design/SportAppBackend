import { Router } from "express";
import { VenueController } from "./venue.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createVenueSchema, favoriteVenueSchema } from "./venue.schema.js";

const router = Router();

// Get List of all venues
router.get("/", authMiddleware, VenueController.list);

// Create a new venue
router.post(
  "/",
  authMiddleware,
  validate(createVenueSchema),
  VenueController.create,
);

// Get venues owned by the authenticated user
router.get("/my-venues", authMiddleware, VenueController.getMyVenues);

// Get available slots for a specific pitch within a venue
router.get(
  "/:venueId/pitches/:pitchId/slots",
  authMiddleware,
  VenueController.getPitchSlots,
);

// Mark a venue as favorite
router.post(
  "/favorite",
  authMiddleware,
  validate(favoriteVenueSchema),
  VenueController.favorite,
);

// Get favorite venues
router.get("/favorites", authMiddleware, VenueController.getFavoriteVenues);

// Must stay last: a single dynamic segment would otherwise shadow the static routes above.
router.get("/:id", authMiddleware, VenueController.getById);

export default router;
