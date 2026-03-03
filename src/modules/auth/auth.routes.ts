import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { sendOtpSchema, verifyOtpSchema } from "./auth.schema";
import { authMiddleware } from "./auth.middleware";

const router = Router();

router.post("/send-otp", validate(sendOtpSchema), AuthController.sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.get('/',authMiddleware, AuthController.getUserInfo);

export default router;
