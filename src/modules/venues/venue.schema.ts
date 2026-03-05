import { z } from "zod";

// const discountSchema = z.object({
//   discountCode: z.string().min(1),
//   discountPercentage: z.number().min(0).max(100),
//   validUntil: z.string().datetime(),
// });

export const createVenueSchema = z.object({
  venueName: z.string().min(1),
  ownerName: z.string().min(1),
  ownerEmail: z.email().optional(),
  ownerPhone: z.string().min(10).max(13),
  venueHandlerContactNumber: z.string().min(10).max(13),
  googleMapsLink: z.url().optional(),
  logitudinalValue: z.number().optional(),
  locality: z.string().min(1),
  city: z.string().min(1),
  landmark: z.string().min(1).optional(),
  pincode: z.string().min(4).max(10),
  amenities: z
    .array(
      z.enum([
        "PARKING",
        "TOILETS",
        "CHANGING_ROOMS",
        "FIRST_AID",
        "WATER_FACILITY",
      ]),
    )
    .min(1),
  opensAt: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/), // HH:mm format
  closesAt: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/), // HH:mm format
  sportTypes: z.array(z.enum(["CRICKET", "FOOTBALL"])).min(1),
  equipmentAvailable: z.array(z.string()).optional(),
  workingDays: z.array(z.string()).optional(),
  // workingDays: z
  //   .array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]))
  //   .min(1),
  slots_available: z
    .array(
      z.enum(["PRE_DAWN", "SLOT1", "SLOT2", "SLOT3", "DNSLOT", "MIDNIGHT"]),
    )
    .optional(),
  prices_weekdays: z.object({
    PRE_DAWN: z.number().optional(),
    SLOT1: z.number().optional(),
    SLOT2: z.number().optional(),
    SLOT3: z.number().optional(),
    DNSLOT: z.number().optional(),
    MIDNIGHT: z.number().optional(),
  }),
  prices_weekends: z.object({
    PRE_DAWN: z.number().optional(),
    SLOT1: z.number().optional(),
    SLOT2: z.number().optional(),
    SLOT3: z.number().optional(),
    DNSLOT: z.number().optional(),
    MIDNIGHT: z.number().optional(),
  }),
  discounts: z.object({
    ALL: z.string().optional(),
    PRE_DAWN: z.string().optional(),
    SLOT1: z.string().optional(),
    SLOT2: z.string().optional(),
    SLOT3: z.string().optional(),
    DNSLOT: z.string().optional(),
    MIDNIGHT: z.string().optional(),
  }),
  photos: z.array(z.url()).optional(),
  onwnerPanCardNumber: z.string().min(10).max(20),
  gstIn: z.string().min(15).max(15),
  bankIFSC: z.string().min(11).max(11),
  bankAccountNumber: z.string().min(9).max(18),
  permits: z.array(z.url()).optional(),
});
