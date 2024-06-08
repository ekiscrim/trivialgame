import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { listRooms, createNormalRoom, createSuperRoom, startRoom, joinRoom, seeRoom, getRoomQuestions, getRoomCategories, getRoomCreator,updateRoomStatus } from "../controllers/room.controller.js";
const router = express.Router();

router.get("/list", protectRoute, listRooms);
router.post("/createNormal", protectRoute, createNormalRoom);
router.post("/createSuper", protectRoute, createSuperRoom);
router.get("/:id", protectRoute, seeRoom) //esta es la que carga la room
router.post("/:roomId/joinRoom", protectRoute, joinRoom)
router.get("/:roomId/questions", protectRoute, getRoomQuestions);
router.get("/:roomId/categories", protectRoute, getRoomCategories);
router.get("/:roomId/creator", protectRoute, getRoomCreator);
router.patch("/:roomId/status", protectRoute, updateRoomStatus);

export default router;