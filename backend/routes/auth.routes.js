import express from "express";
import { getMe, register, login, logout, verifyUser, resendVerificationEmail, deactivate, googleAuth, googleAuthCallback, forgotPassword, resetPassword, verifyToken } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.get("/me", protectRoute, getMe);
router.get("/confirm/:token", verifyUser);
router.post('/resend-verification', resendVerificationEmail);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-token', verifyToken);
router.post("/deactivate", deactivate);

// Rutas de Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

export default router;