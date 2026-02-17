import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/send-otp", AuthController.sendOtp);
router.post("/verify-otp", AuthController.verifyOtp);

export default router;
