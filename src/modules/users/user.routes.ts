import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { UserController } from "./user.controller.js";
import { updateUserSchema } from "./user.schema.js";

const router = Router();


router.get("/",authMiddleware, UserController.getUser);
router.put("/",authMiddleware, validate(updateUserSchema), UserController.updateUser);

export default router;