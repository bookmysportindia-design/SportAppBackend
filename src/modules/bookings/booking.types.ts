import { z } from "zod";
import {
  bookingPreviewSchema,
  confirmBookingSchema,
  getUserBookingsQuerySchema,
  cancelBookingSchema,
  acceptBookingSchema,
} from "./booking.schema.js";

export type BookingPreviewDto = z.infer<typeof bookingPreviewSchema>;
export type ConfirmBookingDto = z.infer<typeof confirmBookingSchema>;
export type GetUserBookingsQuery = z.infer<typeof getUserBookingsQuerySchema>;
export type CancelBookingDto = z.infer<typeof cancelBookingSchema>;
export type AcceptBookingDto = z.infer<typeof acceptBookingSchema>;
