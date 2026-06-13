import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { UserController } from "./user.controller.js";
import { updateUserSchema } from "./user.schema.js";

const router = Router();

// /all must come before / so Express doesn't treat "all" as a path param
// GET /users/all?search= — fetch all users, optionally filtered by name or phone
router.get("/all", authMiddleware, UserController.getAllUsers);
// GET /users — fetch the currently authenticated user's profile
router.get("/", authMiddleware, UserController.getUser);
// PUT /users — update the currently authenticated user's profile
router.put("/", authMiddleware, validate(updateUserSchema), UserController.updateUser);

export default router;