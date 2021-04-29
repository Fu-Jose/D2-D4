import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import articlesRouter from "../src/articles/index.js";
import RevRouter from "./reviews/index.js";
import AuthorRouter from "./authors/index.js";

const server = express();
const PORT = process.env.PORT || 3001;

server.use(express.json());
server.use(cors());

server.use("/articles", articlesRouter);
server.use("/reviews", RevRouter);
server.use("/authors", AuthorRouter);
console.log(listEndpoints(server));

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
