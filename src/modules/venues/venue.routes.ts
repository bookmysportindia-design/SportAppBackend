import { Router } from "express";
import { VenueController } from "./venue.controller";

const router = Router();

router.get("/", VenueController.list);

export default router;
