import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  key: { type: String,
     required: true,
      unique: true
     },
  count: { type: Number,
     default: 0 
    }
});

export default mongoose.model("VisitCount", visitSchema);
