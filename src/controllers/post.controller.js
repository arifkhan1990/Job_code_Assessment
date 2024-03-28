import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content, userId } = req.body;

  if ([title, content, userId].some((field) => field?.trim() === "")) {
    return res.status(400).json(new apiError(400, "All fields are require"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json(new apiError(400, "All fields are require"));
  }

  const newPost = new Post({ title, content, userId });
  await newPost.save();
  if (!newPost) {
    return res.status(500).json(new apiError(500, "Something went wron"));
  }

  return res
    .status(201)
    .json(new apiResponse(200, newPost, "Successfully Posted"));
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json(new apiError(404, "Post not found"));
  }

  res.status(200).json(new apiResponse(200, post, "Posted Successfully."));
});

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (!userLikedPost) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post Liked successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post Unliked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createPost, getPost, likeUnlikePost };
