import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes    from "./routes/userRoutes.js";

const app = express();

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed =
      origin.startsWith("http://localhost") ||
      /https:\/\/ant-travels[a-z0-9\-]*\.vercel\.app/.test(origin) ||
      /https:\/\/[a-z0-9\-]+-sachins-projects-[a-z0-9]+\.vercel\.app/.test(origin);
    allowed ? callback(null, true) : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

// 🔥 ROUTES (IMPORTANT)
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Server Working 🚀");
});

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log("DB ERROR:", err));

// SERVER
app.listen(5000, () => console.log("Server Running 🚀"));