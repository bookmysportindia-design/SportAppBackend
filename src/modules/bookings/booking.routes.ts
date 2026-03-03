import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { BookingController } from "./booking.controller";
import { createBookingSchema } from "./booking.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createBookingSchema),
  BookingController.create,
);

router.get("/", authMiddleware, BookingController.getUserBookings);

router.get("/requests", authMiddleware, BookingController.getBookingRequests);

router.post("/requests/accept", authMiddleware, BookingController.acceptBookingRequest);

router.patch("/cancel", authMiddleware, BookingController.cancel);

export default router;
