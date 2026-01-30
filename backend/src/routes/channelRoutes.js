import express from "express";
import { createChannel, getAllChannels, getChannelById } from "../controllers/channelController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const channelRouter = express.Router();

// Public routes
channelRouter.get("/", getAllChannels);
channelRouter.get("/:id", getChannelById);

// Protected routes
channelRouter.post("/", authMiddleware, createChannel);

export default channelRouter;
