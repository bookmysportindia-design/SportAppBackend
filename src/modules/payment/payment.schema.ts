import z from "zod";

export const CreateOrderSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
});

export const GetPaymentStatusSchema = z.object({
  orderId: z.string().nonempty("Order ID is required"),
});

export const PayUInitiateSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  productinfo: z.string().min(1, "Product info is required").optional(),
  firstname: z.string().min(1, "First name is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  phone: z.string().optional(),
  udf1: z.string().optional(),
  udf2: z.string().optional(),
  udf3: z.string().optional(),
  udf4: z.string().optional(),
  udf5: z.string().optional(),
});

export const PayUHashSchema = z.object({
  hashString: z.string().min(1, "Hash string is required"),
});
