import { Router } from "express";
const router = Router(); // Create a router instance
import { register, login, logout, getProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

router.post("/register", upload.single("avatar"), register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", getProfile)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router;