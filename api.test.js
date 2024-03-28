// Import necessary modules
import request from "supertest";
import { app } from "./src/app.js";
import mongoose from "mongoose";
import { DB_NAME } from "./src/constants.js";
import { DB_URL } from "./src/constants.js";
import connect from "./src/db/mongodb_memorydb_connection.js";

// import connectDB from "./db/mongodb_memorydb_connection.js";

describe("API Endpoints", () => {
  // beforeEach(async () => {
  //   await mongoose.connect(DB_URL);
  // });

  // afterEach(async () => {
  //   await mongoose.connection.close();
  // });

  connect()
    .then(() => {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
      });
    })
    .catch((err) => {
      console.log("MONGO db connection failed !!! ", err);
    });

  it("should test api", async () => {
    const res = await request(app).get("/hello");
    expect(res.statusCode).toEqual(200);
  });

  // Test for /signup endpoint
  it("should create a new user on /signup", async () => {
    return request(app)
      .post("/api/v1/users/signup")
      .send({
        username: "human112",
        fullName: "Human being",
        email: "zyx1@gmail.com",
        password: "123456",
      })
      .expect(201)
      .then((response) => {
        response;
      });
  });

  it("should create a new user duplicate error on /signup", async () => {
    return request(app)
      .post("/api/v1/users/signup")
      .send({
        username: "human112",
        fullName: "Human being",
        email: "zyx1@gmail.com",
        password: "123456",
      })
      .expect(409)
      .then((response) => {
        response;
      });
  });

  // Test for /profile/:query endpoint
  it("should get user profile on /profile/:query", async () => {
    const res = await request(app).get("/api/v1/users/profile/human112");
    expect(res.statusCode).toEqual(200);
  });

  // Test for /profile/:query endpoint
  it("should get user profile on query not found", async () => {
    const res = await request(app).get("/api/v1/users/profile/human152");
    expect(res.statusCode).toEqual(404);
  });

  // Test for /create endpoint
  // it("should create a comment on /create", async () => {
  //   return request(app)
  //     .post("/api/v1/comments/create")
  //     .send({
  //       title: "Test comment",
  //       description: "New things is coming...",
  //       userId: "6604fe9f61dd2c1c82f52c2b",
  //       postId: "66050e9a72ee66f5254c6b14",
  //     })
  //     .expect(201)
  //     .then((response) => {
  //       response;
  //     });
  // });

  // Test for / endpoint
  it("should get all comments on /", async () => {
    const res = await request(app).get("/api/v1/comments/");
    expect(res.statusCode).toEqual(200);
  });

  it("should get all comments on /", async () => {
    const res = await request(app).get(
      "/api/v1/comments/?personalitySystems=INFP,ENFJ&sortBy=best"
    );
    expect(res.statusCode).toEqual(200);
  });

  it("should get all comments on /", async () => {
    const res = await request(app).get(
      "/api/v1/comments/?personalitySystems=INFP,ENFJ"
    );
    expect(res.statusCode).toEqual(200);
  });

  it("should get all comments on /", async () => {
    const res = await request(app).get("/api/v1/comments/?sortBy=best");
    expect(res.statusCode).toEqual(200);
  });
  // Test for /:commentId/like-unlike endpoint
  // it("should like/unlike a comment on /:commentId/like-unlike", async () => {
  //   const res = await request(app).put(
  //     `/api/v1/comments/6604e66989e4f1766550e893/like-unlike`
  //   );
  //   expect(res.statusCode).toEqual(200);
  // });

  // Test for /:commentId/vote-personality-systems endpoint
  // it("should vote on personality systems for a comment on /:commentId/vote-personality-systems", async () => {
  //   const res = await request(app)
  //     .put(`/api/v1/comments/6604e66989e4f1766550e893/vote-personality-systems`)
  //     .send({
  //       mbti: "INFP",
  //       enneagram: "",
  //       zodiac: "",
  //     });
  //   expect(res.statusCode).toEqual(200);
  // });

  //   it("should finish fine again", async function () {
  //     jest.setTimeout(10 * 1000); // not currently working...
  //     await longProcess();
  //     expect(1).toBe(1);
  //   }, 10000);
});
