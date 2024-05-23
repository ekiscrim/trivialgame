import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getResults, getUserScoreInRoom, sendResults} from "../controllers/score.controller.js";

const router = express.Router();

router.post("/score", protectRoute, sendResults);
router.get("/:roomId/results", protectRoute, getResults);
router.get("/:roomId/:userId", protectRoute, getUserScoreInRoom);

export default router;
