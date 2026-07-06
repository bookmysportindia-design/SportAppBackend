import { z } from "zod";

const timeFormat = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const bookingPreviewSchema = z.object({
  venueId: z.uuid(),
  bookingDate: z.string().datetime(),
  startTime: timeFormat,
  endTime: timeFormat,
  sport: z.enum(["CRICKET", "FOOTBALL"]),
  playersPerTeam: z.number().int().min(1).max(11),
  pitchId: z.uuid().optional(),
  tierId: z.uuid().optional(),
  matchType: z.enum(["FRIENDLY", "PRACTICE", "TOURNAMENT"]).optional(),
});

export const confirmBookingSchema = z.object({
  venueId: z.uuid(),
  bookingDate: z.string().datetime(),
  startTime: timeFormat,
  endTime: timeFormat,
  sport: z.enum(["CRICKET", "FOOTBALL"]),
  playersPerTeam: z.number().int().min(1).max(11),
  pitchId: z.uuid().optional(),
  tierId: z.uuid().optional(),
  matchType: z.enum(["FRIENDLY", "PRACTICE", "TOURNAMENT"]).optional(),
});

export const getUserBookingsQuerySchema = z.object({
  date: z.string().date().optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.uuid(),
});

export const acceptBookingSchema = z.object({
  bookingId: z.uuid(),
});
