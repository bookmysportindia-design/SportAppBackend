import z from "zod";
import {
  createMatchSchema,
  getMatchesQuerySchema,
  sendMatchInviteSchema,
  requestJoinMatchSchema,
  respondToMatchInviteSchema,
} from "./match.schema.js";

export type CreateMatchDto = z.infer<typeof createMatchSchema>;
export type GetMatchesQuery = z.infer<typeof getMatchesQuerySchema>;
export type SendMatchInviteDto = z.infer<typeof sendMatchInviteSchema>;
export type RequestJoinMatchDto = z.infer<typeof requestJoinMatchSchema>;
export type RespondToMatchInviteDto = z.infer<typeof respondToMatchInviteSchema>;