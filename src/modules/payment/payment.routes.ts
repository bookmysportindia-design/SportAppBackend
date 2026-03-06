import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { CreateOrderSchema } from "./payment.schema";

const router = Router();

router.post(
  "/initiate-payment",
  authMiddleware,
  validate(CreateOrderSchema),
  PaymentController.initiatePayment,
);

export default router;
