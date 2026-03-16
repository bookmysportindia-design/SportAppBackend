import z from "zod";
import { CreateOrderSchema, GetPaymentStatusSchema } from "./payment.schema.js";

export type createOrderDto = z.infer<typeof CreateOrderSchema>;

export type getPaymentStatusDto = z.infer<typeof GetPaymentStatusSchema>;

export interface OrderTokenResponse {
  orderId: string;
  state: string;
  expiryAt: number;
  token: string;
}
