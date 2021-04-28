import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RevSchema = new Schema({
  text: String,
  user: String,
});

export default model("Rev", RevSchema);
