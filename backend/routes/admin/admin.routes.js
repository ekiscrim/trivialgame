import express from 'express';
const router = express.Router();
import { protectRoute, adminRoute } from '../../middleware/protectRoute.js';
import { createCategory, listCategories, deleteCategory } from '../../controllers/category.controller.js';
import { listQuestions, createQuestion,deleteQuestion,editQuestion } from '../../controllers/question.controller.js'
// Rutas para categorías
router.post('/categories', protectRoute, adminRoute, createCategory);
//router.put('/categories/:id', protectRoute, adminRoute, updateCategory);
router.delete('/categories/:id', protectRoute, adminRoute, deleteCategory);
router.get('/categories', protectRoute, adminRoute, listCategories);
//router.get('/categories/:id', protectRoute, adminRoute, getCategoryById);

// Aquí puedes agregar rutas adicionales para preguntas, salas, y usuarios
router.get('/questions', protectRoute, adminRoute, listQuestions)
router.post('/question', protectRoute, adminRoute, createQuestion);
router.put('/question/:id', protectRoute, adminRoute, editQuestion);
router.delete('/question/:id', protectRoute, adminRoute, deleteQuestion);
export default router;