import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { updateUserStatistics, getUserStats } from "../controllers/user.statistic.controller.js";

const router = express.Router();

router.post('/updateStatistics', protectRoute, updateUserStatistics);
router.get('/:userId/statsByCategory', protectRoute, getUserStats);

export default router;