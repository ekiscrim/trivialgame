import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { listRooms, createRoom, startRoom, joinRoom, seeRoom } from "../controllers/room.controller.js";
import { getQuestionsByCategory } from "../controllers/question.controller.js"
const router = express.Router();

router.get("/list", protectRoute, listRooms);
router.post("/create", protectRoute, createRoom)
router.get("/:id", protectRoute, seeRoom) //esta es la que carga la room
//router.post("/:id/start", protectRoute, startRoom)

export default router;