import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import articlesRouter from "../src/articles/index.js";
import RevRouter from "./reviews/index.js";
import AuthorRouter from "./authors/index.js";
import usersRouter from "../src/users/index.js";
// import { basicAuthMiddleware, adminOnly } from "../src/auth/index.js";
import passport from "passport";
import oauth from "../src/auth/oauth.js";

const server = express();
const PORT = process.env.PORT || 3001;

server.use(express.json());
server.use(cors({ origin: "http://localhost:3001", credentials: true }));
server.use(passport.initialize());

server.use("/articles", articlesRouter);
server.use("/reviews", RevRouter);
server.use("/authors", AuthorRouter);
server.use("/users", usersRouter);
console.table(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(PORT, () => {
      console.log("Server running on port", PORT);
    })
  )
  .catch((err) => console.log(err));
