import express from 'express';
import { getRankings } from '../controllers/ranking.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', protectRoute, getRankings);

export default router;