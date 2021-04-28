import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ArtSchema = new Schema({
  _id: String,
  headLine: String,
  subHead: String,
  content: String,
  category: {
    name: String,
    img: String,
  },
  author: {
    name: String,
    img: String,
  },
  cover: String,
  createdAt: Date,
  updatedAt: Date,
});

export default model("Article", ArtSchema);
