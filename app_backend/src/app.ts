import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server running" });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;
