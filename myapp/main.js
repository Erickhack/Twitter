import express, { json } from "express";
import cors from "cors";

import {
  callBackPostUserId,
  callbackGetUserId,
  callBackGetByIdUserId,
} from "./callbackUserId.js";

import {
  callBackGet,
  callBackGetById,
  callBackPost,
  callbackPut,
  callbackDelete,
} from "./callbackPosts.js";

const port = process.env.PORT ?? 9999;

const app = express();
app.use(cors());
app.use(json());
app.use("/api/static", express.static("public"));

app
  .route("/api/posts")
  .get(callBackGet)
  .post(callBackPost)
  .put(callbackPut)
  .delete(callbackDelete);
app.get("/api/posts/:id", callBackGetById);

app.route("/api/UserId").get(callbackGetUserId).post(callBackPostUserId);
app.get("/api/UserId/:email&:pass", callBackGetByIdUserId);

app.listen(port);
