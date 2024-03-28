import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes import

import userRouter from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRouter);

// test
app.use("/hello", function (req, res) {
  console.log("hello");
  return res.status(200).json({ msg: "Ok" });
});

export { app };
