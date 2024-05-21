import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getCategory, createCategory, listCategories } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/list", protectRoute, listCategories);
router.get("/:title", protectRoute, getCategory);
router.post("/create", protectRoute, createCategory);


export default router;