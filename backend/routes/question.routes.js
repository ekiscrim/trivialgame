import express from 'express';
import { getQuestionsByCategory, validateAnswer, getParticipantProgress } from '../controllers/question.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/category/:categoryId', protectRoute, getQuestionsByCategory);
router.post('/answer', protectRoute, validateAnswer);
router.get('/:userId/:roomId/progress', protectRoute, getParticipantProgress);

export default router;