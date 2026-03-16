import z from "zod";
import { createVenueSchema, favoriteVenueSchema } from "./venue.schema.js";

export type CreateVenueDto = z.infer<typeof createVenueSchema>;

export type FavoriteVenueDto = z.infer<typeof favoriteVenueSchema>;