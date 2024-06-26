import express from 'express';
const router = express.Router();
import { protectRoute, adminRoute } from '../../middleware/protectRoute.js';
import { createCategory, listCategories, deleteCategory, updateCategory } from '../../controllers/category.controller.js';
import { listQuestions, createQuestion,deleteQuestion,editQuestion } from '../../controllers/question.controller.js';
import { listUsers, editUser, deleteUser, impersonateUser } from '../../controllers/user.controller.js';
import { listRoomsAdmin, editRoom } from '../../controllers/room.controller.js';

import bodyParser from "body-parser";
import multer from "multer"

// Rutas para categorías
router.post('/categories', protectRoute, adminRoute, createCategory);
router.put('/categories/:id', protectRoute, adminRoute, updateCategory);
router.delete('/categories/:id', protectRoute, adminRoute, deleteCategory);
router.get('/categories', protectRoute, adminRoute, listCategories);
//router.get('/categories/:id', protectRoute, adminRoute, getCategoryById);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 }, dest: 'uploads/' }); // Initialize multer here


// Rutas para preguntas
router.get('/questions', protectRoute, adminRoute, listQuestions)
router.post('/question', protectRoute, upload.single('image'), adminRoute, createQuestion);
router.put('/question/:id', protectRoute, upload.single('image'), adminRoute, editQuestion);
router.delete('/question/:id', protectRoute, adminRoute, deleteQuestion);

// Rutas para usuarios
router.get('/users', protectRoute, adminRoute, listUsers);
router.put('/user/:id', protectRoute, adminRoute, editUser);
router.delete('/user/:id', protectRoute, adminRoute, deleteUser);
router.post('/impersonate', protectRoute, adminRoute, impersonateUser);

//Rutas para salas
router.get('/rooms', protectRoute, adminRoute, listRoomsAdmin);
router.put('/rooms/:roomId', protectRoute, adminRoute, editRoom);



export default router;