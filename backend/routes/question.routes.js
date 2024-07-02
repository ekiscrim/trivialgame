import express from 'express';
import { getQuestionsByCategory, validateAnswer, getParticipantProgress, getCategoryFromQuestion, getParticipantProgressAll, getParticipants } from '../controllers/question.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/:roomId/getParticipants', protectRoute, getParticipants);
router.get('/category/:categoryId', protectRoute, getQuestionsByCategory);
router.post('/answer', protectRoute, validateAnswer);
router.get('/:userId/:roomId/progress', protectRoute, getParticipantProgress);
router.get('/:questionId/getCategory', protectRoute, getCategoryFromQuestion);
router.get('/:roomId/:userId', protectRoute, getParticipantProgressAll);

export default router;