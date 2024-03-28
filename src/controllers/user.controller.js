import mongoose from "mongoose";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const signupUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    // throw new apiError(500, "Something went wrong while registering the user");
    return res
      .status(409)
      .json(new apiError(409, "User with email or username already exists"));
  }

  const newUser = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id).select("-password");

  if (!createdUser) {
    // throw new apiError(500, "Something went wrong while registering the user");
    return res
      .status(500)
      .json(
        new apiError(500, "Something went wrong while registering the user")
      );
  }

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username && !email) {
    // throw new apiError(400, "username or email is required");
    return res
      .status(400)
      .json(new apiError(400, "username or email is required"));
  }

  const user = await User.findOne({ username });

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    // throw new apiError(401, "Invalid user credentials");
    return res.status(401).json(new apiError(401, "Invalid user credentials"));
  }
  const loggedInUser = await User.findById(user._id).select("-password");
  const accessToken = user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new apiResponse(200, {}, "User logged Out"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { query } = req.params;

  let user;
  if (mongoose.Types.ObjectId.isValid(query)) {
    user = await User.findOne({ _id: query })
      .select("-password")
      .select("-updated_at");
  } else {
    user = await User.findOne({ username: query })
      .select("-password")
      .select("-updated_at");
  }

  if (!user) {
    // throw new apiError(400, "User not found");
    return res.status(404).json(new apiError(404, "User not foun"));
  }
  return res.status(200).json(new apiResponse(200, user));
});

export { signupUser, loginUser, logoutUser, getUserProfile };
