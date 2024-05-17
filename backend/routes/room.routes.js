import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { listRooms, createRoom, startRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/list", protectRoute, listRooms);
router.post("/create", protectRoute, createRoom)
router.post("/:id/start", protectRoute, startRoom)

export default router;