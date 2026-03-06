import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .default("5000")
    .transform((val) => Number(val)),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  A2Z_USERNAME: z.string().min(1, "A2Z_USERNAME is required"),

  A2Z_PASSWORD: z.string().min(1, "A2Z_PASSWORD is required"),

  A2Z_FROM: z
    .string()
    .min(3, "A2Z_FROM is required")
    .max(6, "A2Z_FROM must be max 6 characters"),

  A2Z_PEID: z.string().min(1, "A2Z_PEID is required"),

  A2Z_TEMPLATE_ID: z.string().min(1, "A2Z_TEMPLATE_ID is required"),

  PHONEPE_CLIENTID: z.string().min(1, "PHONEPE_CLIENTID is required"),

  PHONEPE_CLIENT_VERSION: z
    .string()
    .min(1, "PHONEPE_CLIENT_VERSION is required"),

  PHONEPE_CLIENT_SECRET: z.string().min(1, "PHONEPE_CLIENT_SECRET is required")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
