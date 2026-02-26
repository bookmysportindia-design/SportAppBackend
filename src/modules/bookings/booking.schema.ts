import { z } from "zod";

export const createBookingSchema = z.object({
  venueId: z.string().uuid(),
  bookingDate: z.string().datetime(),
  slot: z.enum(["EARLY", "MORNING", "AFTERNOON", "EVENING"]),
  sport: z.enum(["CRICKET", "FOOTBALL"]),
  playersPerTeam: z.number().int().min(1).max(11),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
});
