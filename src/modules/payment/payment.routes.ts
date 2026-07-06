import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  CreateOrderSchema,
  GetPaymentStatusSchema,
  PayUInitiateSchema,
  PayUHashSchema,
} from "./payment.schema.js";

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

router.post(
  "/payu/initiate",
  authMiddleware,
  validate(PayUInitiateSchema),
  PaymentController.initiatePayU,
);

router.post(
  "/payu/hash",
  authMiddleware,
  validate(PayUHashSchema),
  PaymentController.getPayUHash,
);

export default router;
