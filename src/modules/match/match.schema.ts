import z from "zod";

const emptyToUndefined = (val: unknown) =>
  val === "null" || val === "undefined" || val === "" ? undefined : val;

export const getMatchesQuerySchema = z.object({
  date: z.preprocess(emptyToUndefined, z.iso.date().optional()),
  search: z.string().min(1).optional(),
  status: z
    .enum([
      "PAYMENT_PENDING",
      "UNDER_REVIEW",
      "SCHEDULED",
      "POSTPONED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  type: z.enum(["FRIENDLY", "PRACTICE", "TOURNAMENT"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const createMatchSchema = z.object({
  status: z
    .enum([
      "PAYMENT_PENDING",
      "UNDER_REVIEW",
      "SCHEDULED",
      "POSTPONED",
      "ONGOING",
      "COMPLETED",
      "CANCELLED",
    ])
    .default("PAYMENT_PENDING"),
  type: z.enum(["FRIENDLY", "PRACTICE", "TOURNAMENT"]),
  matchDate: z.iso.datetime(),
  bookingId: z.uuid("Invalid booking ID"),
  paymentMethod: z.enum(["TEAM_WALLET", "SPLIT", "PAID_BY_CAPTAIN"]),
});

export const sendMatchInviteSchema = z.object({
  matchId: z.uuid("Invalid match ID"),
  teamId: z.uuid("Invalid team ID"),
  playerId: z.uuid("Invalid player ID"),
});

export const requestJoinMatchSchema = z.object({
  matchId: z.uuid("Invalid match ID"),
  teamId: z.uuid("Invalid team ID"),
});

export const respondToMatchInviteSchema = z.object({
  inviteId: z.uuid("Invalid invite ID"),
  accept: z.boolean(),
});
