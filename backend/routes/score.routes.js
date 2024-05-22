import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getResults, sendResults} from "../controllers/score.controller.js";

const router = express.Router();

router.post("/score", protectRoute, sendResults);
router.get("/:roomId/results", protectRoute, getResults);

export default router;
