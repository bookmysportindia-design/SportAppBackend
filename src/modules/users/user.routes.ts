import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../auth/auth.middleware";
import { UserController } from "./user.controller";
import { updateUserSchema } from "./user.schema";

const router = Router();


router.get("/",authMiddleware, UserController.getUser);
router.put("/",authMiddleware, validate(updateUserSchema), UserController.updateUser);

export default router;