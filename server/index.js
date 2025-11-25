import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  connectDB from "./utils/dbConnect.js";

import kohliRoutes from "./controllers/kohli/index.js";
import commentRoutes from "./controllers/comments/index.js"
import pollRoutes from "./controllers/polls/index.js"

dotenv.config();
connectDB()

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/kohli", kohliRoutes);
app.use("/api/kohli/comments", commentRoutes);
app.use("/api/kohli/poll", pollRoutes);

app.get("/", (req, res) => {
  res.send("Kohli backend running...");
});

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server started.");
});
