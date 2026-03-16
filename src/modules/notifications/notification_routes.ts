import { Router } from "express";
import { NotificationController } from "./notification_controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createNotificationSchema } from "./notification_schema.js";

const router = Router();

router.get("/", authMiddleware, NotificationController.getNotifications);
router.post(
  "/",
  authMiddleware,
  validate(createNotificationSchema),
  NotificationController.createNotification,
);

export default router;
