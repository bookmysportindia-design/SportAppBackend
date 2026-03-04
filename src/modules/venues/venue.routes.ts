import { Router } from "express";
import { VenueController } from "./venue.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createVenueSchema, listVenuesQuerySchema } from "./venue.schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validate(listVenuesQuerySchema),
  VenueController.list,
);

router.post(
  "/",
  authMiddleware,
  validate(createVenueSchema),
  VenueController.create,
);

router.get("/my-venues", authMiddleware, VenueController.getMyVenues);

export default router;
