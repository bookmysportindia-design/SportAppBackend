import z from "zod";

export const discoverTeamsQuerySchema = z.object({
  search: z.string().min(1).optional(),
});

export const opponentTeamsQuerySchema = z.object({
  search: z.string().min(1).optional(),
  sport: z.enum(["CRICKET", "FOOTBALL"]).optional(),
});
