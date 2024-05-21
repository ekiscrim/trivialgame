import express from 'express';
import { getQuestionsByCategory, validateAnswer, createQuestion } from '../controllers/question.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/category/:categoryId', protectRoute, getQuestionsByCategory);
router.post('/answer', protectRoute, validateAnswer);
router.post("/create", protectRoute, createQuestion);
export default router;