import z from "zod";
import { createMatchSchema, getMatchesQuerySchema } from "./match.schema.js";

export type CreateMatchDto = z.infer<typeof createMatchSchema>;
export type GetMatchesQuery = z.infer<typeof getMatchesQuerySchema>;