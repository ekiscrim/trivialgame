import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserStats } from "../controllers/question.controller.js";

const router = express.Router();

router.get("/:userId/:roomId", protectRoute, getUserStats);
//router.get("/selectedusers/:roomId/:questionId", protectRoute, getUsersByAnswer);


export default router;