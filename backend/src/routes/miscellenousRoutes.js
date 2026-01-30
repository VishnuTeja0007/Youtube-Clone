import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import toggleLikeController from "../controllers/actionsControllers/likeController";
import toggleDislikeController from "../controllers/actionsControllers/dislikeController";
import toggleSubscibeController from "../controllers/actionsControllers/subscribeController";

const actionRoutes=app.router()

// actionRoutes.get("/",)
actionRoutes.post("/likes",authMiddleware,toggleLikeController)
actionRoutes.post("/subscribe",authMiddleware,toggleSubscibeController)
actionRoutes.post("/dislikes",authMiddleware,toggleDislikeController)
// actionRoutes.post("/watchhistory",authMiddleware,getWatchHistory)