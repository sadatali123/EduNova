import { Router } from "express";
const router = Router(); // Create a router instance
import { register, login, logout, getProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { forgotPassword, resetPassword, changePassword, updateProfile } from "../controllers/user.controller.js";


router.post("/register", upload.single("avatar"), register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", isLoggedIn, getProfile)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:resetToken", resetPassword)
router.post("/change-password", isLoggedIn, changePassword)
router.put("/update-profile", isLoggedIn, upload.single("avatar"), updateProfile) // route for updating user profile details, protected route that requires authentication

export default router; 