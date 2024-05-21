import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, updateUser, getUserNameById } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/:id", protectRoute, getUserNameById)
router.post("/update", protectRoute, updateUser);

export default router;