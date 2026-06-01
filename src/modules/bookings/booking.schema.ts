import { z } from "zod";
import { Slot } from "../../../prisma/generated/prisma/enums.js";

export const createBookingSchema = z.object({
  venueId: z.string().uuid(),
  bookingDate: z.string().datetime(),
  slot: z.enum(Slot),
  sport: z.enum(["CRICKET", "FOOTBALL"]),
  playersPerTeam: z.number().int().min(1).max(11),
  offerCode: z.string().optional(),
});

export const getUserBookingsQuerySchema = z.object({
  date: z.string().date().optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
});

export const acceptBookingSchema = z.object({
  bookingId: z.string().uuid(),
});
