import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { BookingController } from "./booking.controller.js";
import { bookingPreviewSchema, confirmBookingSchema } from "./booking.schema.js";

const router = Router();

router.post(
  "/preview",
  authMiddleware,
  validate(bookingPreviewSchema),
  BookingController.preview,
);

router.post(
  "/confirm",
  authMiddleware,
  validate(confirmBookingSchema),
  BookingController.confirm,
);

router.get("/", authMiddleware, BookingController.getUserBookings);

router.get("/requests", authMiddleware, BookingController.getBookingRequests);

router.post("/requests/accept", authMiddleware, BookingController.acceptBookingRequest);

router.patch("/cancel", authMiddleware, BookingController.cancel);

export default router;
