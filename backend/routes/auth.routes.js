import express from "express";
import { getMe, register, login, logout, verifyUser, resendVerificationEmail } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.get("/me", protectRoute, getMe);
router.get("/confirm/:token", verifyUser);
router.post('/resend-verification', resendVerificationEmail);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


export default router;