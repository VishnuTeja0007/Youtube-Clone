import express from "express";
import { createChannel, getAllChannels, getChannelById, deleteChannel } from "../controllers/channelController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requestLogger } from "../middlewares/Logger.js";

const channelRouter = express.Router();

// Public routes
channelRouter.get("/", requestLogger, getAllChannels);
channelRouter.get("/:id", requestLogger, getChannelById);

// Protected routes
channelRouter.post("/", authMiddleware, createChannel);
channelRouter.delete("/:id", authMiddleware, deleteChannel);

export default channelRouter;
