import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

// router.post("/user", validate(getUserSchema), UserController.getUser);
// router.put("/user", validate(updateUserSchema), UserController.updateUser);

export default router;