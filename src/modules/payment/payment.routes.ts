import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { CreateOrderSchema, GetPaymentStatusSchema } from "./payment.schema.js";

const router = Router();

router.post(
  "/initiate-payment",
  authMiddleware,
  validate(CreateOrderSchema),
  PaymentController.initiatePayment,
);

router.post(
  "/status",
  authMiddleware,
  validate(GetPaymentStatusSchema),
  PaymentController.getPaymentStatus,
);

export default router;
