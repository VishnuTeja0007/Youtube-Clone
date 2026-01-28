import express from "express";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";
// Register all API routes for different endpoints of the application
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});



export default app;
