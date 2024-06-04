import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { updateUserStatistics, getUserStats, getRankingStats } from "../controllers/user.statistic.controller.js";

const router = express.Router();

router.post('/updateStatistics', protectRoute, updateUserStatistics);
router.get('/:userId/statsByCategory', protectRoute, getUserStats);
router.get('/rankings', protectRoute, getRankingStats);
export default router;