import { Router } from "express";
const router = Router(); // Create a router instance
import { register, login, logout, getProfile } from "../controllers/user.controller.js";

router.post("/register", upload.single("avatar"), register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", getProfile)

export default router;