// routes/commentRoutes.js
import express from "express";
import { getAllComments, handleCommentEdits } from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const commentRouter = express.Router();

// Get comments for a specific video (e.g., /api/comments/6979f9...)
commentRouter.get("/:videoId", getAllComments);

// Patch a specific comment by its own ID
// commentRouter.patch("/:id",authMiddleware, handleCommentEdits);

commentRouter.patch("/:id", handleCommentEdits);

export default commentRouter;