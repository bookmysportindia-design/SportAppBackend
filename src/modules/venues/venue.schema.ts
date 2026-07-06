import { z } from "zod";

const timeFormat = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const pitchSchema = z.object({
  name: z.string().optional(),
  pitchType: z.enum(["MATCH_PITCH", "PRACTICE_NETS", "BOX_CRICKET_AREA"]),
  surfaceType: z.enum(["TURF", "MATTING", "ASTRO_TURF", "CEMENT"]),
  boundary: z.number().int().positive().optional(),
});

const dayPricingSchema = z.object({
  day: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
  basePrice: z.number().int().positive(),
  isEnabled: z.boolean().default(true),
});

const timeSlotPricingSchema = z.object({
  name: z.string().min(1),
  startTime: timeFormat,
  endTime: timeFormat,
  multiplier: z.number().positive(),
});

const slotTierSchema = z.object({
  name: z.string().min(1),
  multiplier: z.number().positive(),
  description: z.string().optional(),
});

const discountConfigSchema = z.object({
  name: z.string().min(1),
  bookingType: z.enum(["FRIENDLY", "PRACTICE", "TOURNAMENT"]),
  discountType: z.enum(["FLAT", "PERCENTAGE"]),
  value: z.number().positive(),
});

const bankDetailsSchema = z.object({
  accountNumber: z.string().min(9).max(18),
  accountHolderName: z.string().min(1),
  ifscCode: z.string().min(11).max(11),
});

export const createVenueSchema = z.object({
  name: z.string().min(1),
  groundType: z.enum(["TURF_WICKET", "MATTING_WICKET", "BOX_CRICKET", "INDOOR_NETS"]),
  city: z.string().min(1),
  state: z.string().min(1),
  address: z.string().min(1),
  landmark: z.string().optional(),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  openingTime: timeFormat,
  closingTime: timeFormat,
  slotDuration: z.enum(["ONE_HOUR", "ONE_AND_HALF_HOURS", "TWO_HOURS", "THREE_HOURS"]),
  workingDays: z.array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"])).min(1),
  sportTypes: z.array(z.enum(["CRICKET", "FOOTBALL"])).min(1),

  amenities: z.array(
    z.enum(["PARKING", "TOILETS", "CHANGING_ROOMS", "FIRST_AID", "WATER_FACILITY"]),
  ).default([]),
  photos: z.array(z.string()).default([]),
  pitches: z.array(pitchSchema).optional(),
  bankDetails: bankDetailsSchema.optional(),
  documents: z.array(z.object({
    type: z.string().min(1),
    url: z.string().url(),
  })).optional(),

  dayPricings: z.array(dayPricingSchema).optional(),
  timeSlotPricings: z.array(timeSlotPricingSchema).optional(),
  slotTiers: z.array(slotTierSchema).optional(),
  discountConfigs: z.array(discountConfigSchema).optional(),
});


export const favoriteVenueSchema = z.object({
  venueId: z.string().min(1),
});