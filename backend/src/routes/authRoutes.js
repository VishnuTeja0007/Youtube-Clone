import express from "express";
import registerController from "../controllers/registerController.js";
import loginController from "../controllers/loginController.js";

//comment
const router = express.Router();

//comment
router.post("/register", registerController);
router.post("/login", loginController);

export default router;