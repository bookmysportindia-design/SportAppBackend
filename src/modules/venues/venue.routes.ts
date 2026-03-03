import { Router } from "express";
import { VenueController } from "./venue.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/", authMiddleware, VenueController.list);

router.get("/my-venues", authMiddleware, VenueController.getMyVenues);

export default router;
