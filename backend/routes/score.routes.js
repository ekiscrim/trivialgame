import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getResults, getUserScoreInRoom, sendResults, finalScoreAlreadyExists, getUserLastScores} from "../controllers/score.controller.js";

const router = express.Router();

router.post("/score", protectRoute, sendResults);
router.get("/:roomId/results", protectRoute, getResults);
router.get("/:roomId/:userId", protectRoute, getUserScoreInRoom);
router.get("/user/:userId/last-scores", protectRoute, getUserLastScores);
router.get("/:userId/:roomId", protectRoute, finalScoreAlreadyExists);

export default router;