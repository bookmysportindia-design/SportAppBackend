import z from "zod";
import {
  CreateOrderSchema,
  GetPaymentStatusSchema,
  PayUInitiateSchema,
  PayUHashSchema,
} from "./payment.schema.js";

export type createOrderDto = z.infer<typeof CreateOrderSchema>;

export type getPaymentStatusDto = z.infer<typeof GetPaymentStatusSchema>;

export type PayUInitiateDto = z.infer<typeof PayUInitiateSchema>;

export type PayUHashDto = z.infer<typeof PayUHashSchema>;

export interface OrderTokenResponse {
  orderId: string;
  state: string;
  expiryAt: number;
  token: string;
}

export interface PayUInitiateResponse {
  txnId: string;
  key: string;
  amount: number;
  productinfo?: string;
  firstname?: string;
  email?: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}
