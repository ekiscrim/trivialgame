import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { listRooms, createRoom, startRoom, joinRoom, seeRoom, getRoomQuestions, getRoomCategories, getRoomCreator } from "../controllers/room.controller.js";
const router = express.Router();

router.get("/list", protectRoute, listRooms);
router.post("/create", protectRoute, createRoom)
router.get("/:id", protectRoute, seeRoom) //esta es la que carga la room
router.post("/:roomId/joinRoom", protectRoute, joinRoom)
router.get("/:roomId/questions", protectRoute, getRoomQuestions);
router.get("/:roomId/categories", protectRoute, getRoomCategories);
router.get("/:roomId/creator", protectRoute, getRoomCreator);

export default router;