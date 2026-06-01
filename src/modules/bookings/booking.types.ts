import { z } from "zod";
import {
  createBookingSchema,
  getUserBookingsQuerySchema,
  cancelBookingSchema,
  acceptBookingSchema,
} from "./booking.schema.js";

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type GetUserBookingsQuery = z.infer<typeof getUserBookingsQuerySchema>;
export type CancelBookingDto = z.infer<typeof cancelBookingSchema>;
export type AcceptBookingDto = z.infer<typeof acceptBookingSchema>;
