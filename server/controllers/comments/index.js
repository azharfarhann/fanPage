// import express from "express";
// import Comment from "../../models/Comment.js";

// const router = express.Router();

// // GET latest 5 comments + total count
// router.get("/", async (req, res) => {
//   try {
//     // find latest 5 sorted by createdAt 
//     const comments = await Comment.find().sort({ createdAt: -1 }).limit(5);
//     const total = await Comment.countDocuments();
//     res.status(200).json({ comments, total });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Could not fetch comments." });
//   }
// });

// // POST add comment
// router.post("/add", async (req, res) => {
//   try {
//     const { name, text } = req.body;
//     if (!text || !text.trim()) {
//       return res.status(400).json({ msg: "Comment text required." });
//     }
//     const comment = await Comment.create({ name: name || "Anonymous", text: text.trim() });
//     res.status(201).json({ msg: "Comment added.", comment });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Could not add comment." });
//   }
// });

// export default router;




// controllers/comments/index.js
import express from "express";
import Comment from "../../models/Comment.js"; 

const router = express.Router();

// GET latest 5 comments + total
router.get("/", async (req, res) => {
  try {
    const latestComments = await Comment.find().sort({ createdAt: -1 }).limit(5);
    const total = await Comment.countDocuments();
    return res.json({ latestComments, total });
  } catch (err) {
    console.error("GET /comments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST add comment 
router.post("/", async (req, res) => {
  try {
    const { name = "Guest", text = "" } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const comment = await Comment.create({
      name: String(name).trim() || "Guest",
      text: String(text).trim()
    });

    const latestComments = await Comment.find().sort({ createdAt: -1 }).limit(5);
    const total = await Comment.countDocuments();

    return res.status(201).json({ comment, latestComments, total });
  } catch (err) {
    console.error("POST /comments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
