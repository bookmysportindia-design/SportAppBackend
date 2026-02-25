import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.all("/user",authMiddleware);

// router.post("/user", validate(getUserSchema), UserController.getUser);
// router.put("/user", validate(updateUserSchema), UserController.updateUser);

export default router;