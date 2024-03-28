import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { tag, voting_options } from "../constants.js";

// Function to filter comments by personality systems
const filterComments = (comments, personalitySystems) => {
  return comments.filter((comment) => {
    if (comment && comment.voting) {
      const { MBTI, Enneagram, Zodiac } = comment.voting;
      return personalitySystems.some((personality) => {
        return (
          MBTI === personality ||
          Enneagram === personality ||
          Zodiac === personality
        );
      });
    } else {
      return false;
    }
  });
};

// Function to sort comments by most recent or most likes
const sortComments = (comments, sortBy) => {
  if (sortBy === "recent") {
    return comments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (sortBy === "best") {
    return comments.sort((a, b) => b.likes.length - a.likes.length);
  } else {
    return comments;
  }
};

const createComment = asyncHandler(async (req, res) => {
  const { title, description, postId, userId } = req.body;
  if ([title, postId, userId].some((field) => field?.trim() === "")) {
    return res.status(400).json(new apiError(400, "All fields are required"));
  }

  const newComment = new Comment({
    title,
    description,
    postId,
    userId,
  });
  await newComment.save();

  res.status(201).json(new apiResponse(201, newComment, "New comment added"));
});

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const likeUnlikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return res.status(404).json(new apiError(404, "Comment not found"));
  }
  const { userId } = req.body;
  const userIndex = comment.likes.indexOf(userId);
  let msg = "";
  if (userIndex === -1) {
    comment.likes.push(userId);
    msg = "Comment Liked successfully";
  } else {
    comment.likes.splice(userIndex, 1);
    msg = "Comment Unliked successfully";
  }

  await comment.save();
  res.status(200).json(new apiResponse(200, comment.likes.length, msg));
});

const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find();

  const personalitySystems = req.query.personalitySystems;
  var filter_comment = comments;
  if (personalitySystems) {
    filter_comment = filterComments(comments, personalitySystems.split(","));
  }

  const sortBy = req.query.sortBy;
  if (sortBy) {
    filter_comment = sortComments(filter_comment, sortBy || "recent");
  }
  res.status(200).json(new apiResponse(200, filter_comment));
});

const votePersonalitySystems = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  const { mbti, enneagram, zodiac } = req.body;

  // Update the personality systems in the comment
  const voting = {
    MBTI: mbti,
    Enneagram: enneagram,
    Zodiac: zodiac,
  };

  comment.voting = voting;

  await comment.save();
  res.status(200).json({ message: "Personality systems voted successfully" });
});

export {
  createComment,
  getPostComments,
  getComments,
  likeUnlikeComment,
  votePersonalitySystems,
};
