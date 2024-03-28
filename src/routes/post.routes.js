import express from "express";
import {
  createPost,
  getPost,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/:id", getPost);
router.post("/create", createPost);
router.put("/like/:id", likeUnlikePost);

export default router;
