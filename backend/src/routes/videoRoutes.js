import express from "express";
import { getAllVideos, getVideoById } from "../controllers/videoController.js";

//comment
const VideoRouter = express.Router();

//comment
VideoRouter.get("/", getAllVideos);
VideoRouter.get("/:id", getVideoById);

export default VideoRouter;