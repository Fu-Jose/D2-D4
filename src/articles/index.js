import express from "express";
import ArticleModel from "./schema.js";
import { v4 as uuid } from "uuid";
const articlesRouter = express.Router();

articlesRouter.get("/", async (req, res, next) => {
  try {
    const articles = await ArticleModel.find();
    res.send(articles);
  } catch (error) {
    next(error);
  }
});
articlesRouter.get("/:_id", async (req, res, next) => {
  try {
    const articles = await ArticleModel.findById(req.params._id);
    res.send(articles);
  } catch (error) {
    next(error);
  }
});
articlesRouter.post("/", async (req, res, next) => {
  try {
    const newArticle = await ArticleModel(req.body);
    const { _id } = await newArticle.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});
articlesRouter.put("/:_id", async (req, res, next) => {
  try {
    const modArticle = await ArticleModel.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modArticle) {
      res.send(modArticle);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});
articlesRouter.delete("/:_id", async (req, res, next) => {
  try {
    const articles = await ArticleModel.findByIdAndDelete(req.params._id);
    if (articles) {
      res.send("DELETED");
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

export default articlesRouter;
