import express from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile/:query", getUserProfile); // profile search by username or fullname or id
router.post("/logout", logoutUser);

export default router;
