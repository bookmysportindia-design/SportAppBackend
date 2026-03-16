import { Router } from "express";
import { VenueController } from "./venue.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createVenueSchema, favoriteVenueSchema } from "./venue.schema.js";

const router = Router();

router.get("/", authMiddleware, VenueController.list);

router.post(
  "/",
  authMiddleware,
  validate(createVenueSchema),
  VenueController.create,
);

router.get("/my-venues", authMiddleware, VenueController.getMyVenues);

router.post("/favorite", authMiddleware ,validate(favoriteVenueSchema), VenueController.favorite);

router.get("/favorites", authMiddleware, VenueController.getFavoriteVenues);

export default router;
