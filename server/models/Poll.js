import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { _id: false }); 

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: { type: [optionSchema] }
}, { timestamps: true });

export default mongoose.model("Poll", pollSchema);
