import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { sendOtpSchema, verifyOtpSchema } from "./auth.schema.js";
import { authMiddleware } from "./auth.middleware.js";

const router = Router();

router.post("/send-otp", validate(sendOtpSchema), AuthController.sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.get('/',authMiddleware, AuthController.getUserInfo);

export default router;
