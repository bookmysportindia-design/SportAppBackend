import z from "zod";
import { CreateOrderSchema } from "./payment.schema";

export type createOrderDto = z.infer<typeof CreateOrderSchema>;

export interface OrderTokenResponse {
  orderId: string;
  state: string;
  expiryAt: number;
  token: string;
}
