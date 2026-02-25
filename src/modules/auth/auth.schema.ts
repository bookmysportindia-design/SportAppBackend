import { z } from "zod";

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(10, "Phone too long")
    .regex(/^[0-9]+$/, "Phone must contain only digits"),
});

export const verifyOtpSchema = z.object({
  phone: z.string(),
  otp: z
    .string()
    .length(4, "OTP must be 6 digits")
    .regex(/^[0-9]+$/, "OTP must contain only digits"),
});
