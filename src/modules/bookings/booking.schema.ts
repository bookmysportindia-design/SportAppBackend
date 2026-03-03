import { z } from "zod";
import { Slot } from "../../../prisma/generated/prisma/enums";

export const createBookingSchema = z.object({
  venueId: z.string().uuid(),
  bookingDate: z.string().datetime(),
  slot: z.enum(Slot),
  sport: z.enum(["CRICKET", "FOOTBALL"]),
  playersPerTeam: z.number().int().min(1).max(11),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
});
