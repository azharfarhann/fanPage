import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { _id: false }); 

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: { type: [optionSchema] },
  voters: {
    type: [String], // store voter IDs
    default: []
  }
}, { timestamps: true });

export default mongoose.model("Poll", pollSchema);


// import mongoose from "mongoose";

// const optionSchema = new mongoose.Schema({
//   text: String,
//   votes: {
//     type: Number,
//     default: 0
//   }
// }, { _id: false }); // no extra _id per option

// const pollSchema = new mongoose.Schema({
//   question: {
//     type: String,
//     required: true
//   },
//   options: [optionSchema],
//   voters: {
//     type: [String], // store voter IDs
//     default: []
//   }
// }, { timestamps: true });

// export default mongoose.model("Poll", pollSchema);