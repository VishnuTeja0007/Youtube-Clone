import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";



dotenv.config();
connectDB();



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
