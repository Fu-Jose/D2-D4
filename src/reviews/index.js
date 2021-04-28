import express from "express";

import RevModel from "./schema.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await RevModel.find();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:_reviewId", async (req, res, next) => {
  try {
    const _reviewId = req.params._reviewId;
    const reviews = await RevModel.findById(_reviewId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newReview = await RevModel(req.body);
    await newReview.save();
    res.status(201).send(newReview);
  } catch (error) {
    next(error);
  }
});

router.delete("/:_reviewId", async (req, res, next) => {
  try {
    const _reviewId = req.params._reviewId;
    const reviews = await RevModel.findByIdAndDelete(_reviewId);
    if (reviews) {
      res.send("Deleted");
    }
  } catch (error) {
    next(error);
  }
});
export default router;
