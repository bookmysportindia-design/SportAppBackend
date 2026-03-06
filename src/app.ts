import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import bookingRoutes from "./modules/bookings/booking.routes";
import venueRoutes from "./modules/venues/venue.routes";
import paymentRoutes from "./modules/payment/payment.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/payments", paymentRoutes);

app.use(errorMiddleware);

export default app;
