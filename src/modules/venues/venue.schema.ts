import { z } from "zod";

export const listVenuesQuerySchema = z.object({
  city: z.string().optional(),
  sport: z.enum(["CRICKET", "FOOTBALL"]).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["name", "createdAt"]).optional(),
});
