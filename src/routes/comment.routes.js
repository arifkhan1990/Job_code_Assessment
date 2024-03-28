import express from "express";

import {
  createComment,
  getPostComments,
  getComments,
  likeUnlikeComment,
  votePersonalitySystems,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", createComment);
router.get("/", getComments);
router.get("/:postId", getPostComments);
// router.get("/:postId/commentId", getPostSingleComments);
// router.get("/:commentId", getSigleComments);
router.put("/:commentId/like-unlike", likeUnlikeComment);
router.put("/:commentId/vote-personality-systems", votePersonalitySystems);

export default router;
