import type { z } from "zod";
import { sendOtpSchema, verifyOtpSchema } from "./auth.schema.js";

export type SendOtpDto = z.infer<typeof sendOtpSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phone: string;
  };
}
