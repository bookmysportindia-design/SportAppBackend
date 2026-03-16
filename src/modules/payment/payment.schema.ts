import z from "zod";

export const CreateOrderSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
});

export const GetPaymentStatusSchema = z.object({
  orderId: z.string().nonempty("Order ID is required"),
});
