import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import venueRoutes from "./modules/venues/venue.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import notificationRoutes from "./modules/notifications/notification_routes.js";
import teamRoutes from "./modules/team/team.routes.js";

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
app.use("/api/notifications", notificationRoutes);
app.use("/api/teams", teamRoutes);

app.use(errorMiddleware);

export default app;
