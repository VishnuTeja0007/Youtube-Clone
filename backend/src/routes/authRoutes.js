import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";
import updateUserController from "../controllers/updateUserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requestLogger } from "../middlewares/Logger.js";

//comment
const router = express.Router();
router.use(requestLogger);

//comment
router.post("/register", registerController);
router.post("/login", loginController);
router.put("/update", authMiddleware, updateUserController);

export default router;