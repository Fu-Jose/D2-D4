import express from "express";
import ArticleModel from "./schema.js";
import RevModel from "../reviews/schema.js";
import q2m from "query-to-mongo";
import mongoose from "mongoose";
const articlesRouter = express.Router();

articlesRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await ArticleModel.countDocuments(query.criteria);

    const articles = await ArticleModel.find(
      query.criteria,
      query.options.fields
    )
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send({ links: query.links("/articles", total), articles });
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

articlesRouter.get("/:_id/reviews/:_rid", async (req, res, next) => {
  try {
    const { reviews } = await ArticleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params._id),
      },
      {
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params._rid) },
        },
      }
    );
    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

export default articlesRouter;
