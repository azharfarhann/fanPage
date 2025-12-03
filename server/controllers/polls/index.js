// import express from "express";
// import Poll from "../../models/Poll.js";

// const router = express.Router();

// // GET POLL
// router.get("/", async (req, res) => {
//   try {
//     const poll = await Poll.findOne().sort({ createdAt: -1 });
//     res.json(poll);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // CREATE POLL
// router.post("/", async (req, res) => {
//   try {
//     const { question, options } = req.body;

//     if (!question || !question.trim()) {
//       return res.status(400).json({ message: "Question required" });
//     }

//     if (!Array.isArray(options) || options.length < 2) {
//       return res.status(400).json({ message: "At least 2 options required" });
//     }

//     // map to convert strings → objects
//     const formattedOptions = options.map(opt => ({
//       text: opt.trim(),
//       votes: 0
//     }));

//     const poll = await Poll.create({
//       question: question.trim(),
//       options: formattedOptions
//     });

//     res.status(201).json(poll);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // VOTE
// router.post("/:id/vote", async (req, res) => {
//   try {
//     const pollId = req.params.id;
//     const { optionIndex } = req.body;

//     const poll = await Poll.findById(pollId);
//     if (!poll) return res.status(404).json({ message: "Poll not found" });

//     if (optionIndex < 0 || optionIndex >= poll.options.length) {
//       return res.status(400).json({ message: "Invalid option" });
//     }

//     // simple increment
//     poll.options[optionIndex].votes += 1;

//     await poll.save();
//     res.json(poll);

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

////// ************************************************************  ////////

// controllers/polls/index.js
// import express from "express";
// import Poll from "../../models/Poll.js";

// const router = express.Router();

// // GET latest poll
// router.get("/", async (req, res) => {
//   try {
//     const poll = await Poll.findOne().sort({ createdAt: -1 });
//     return res.status(200).json({ poll });
//   } catch (err) {
//     console.error("GET /poll error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// // CREATE poll
// router.post("/", async (req, res) => {
//   try {
//     const { question, options } = req.body;
//     if (!question || !question.trim()) {
//       return res.status(400).json({ message: "Question required" });
//     }
//     if (!Array.isArray(options) || options.length < 2) {
//       return res.status(400).json({ message: "At least 2 options required" });
//     }

//     const formattedOptions = options.map(opt => ({
//       text: String(opt).trim(),
//       votes: 0
//     }));

//     const poll = await Poll.create({
//       question: question.trim(),
//       options: formattedOptions
//     });

//     return res.status(201).json({ poll });
//   } catch (err) {
//     console.error("POST /poll error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/:id/vote", async (req, res) => {
//   try {
//     const pollId = req.params.id;
//     const { optionIndex } = req.body;

//     const poll = await Poll.findById(pollId);
//     if (!poll) return res.status(404).json({ message: "Poll not found" });

//     if (typeof optionIndex !== "number" || optionIndex < 0 || optionIndex >= poll.options.length) {
//       return res.status(400).json({ message: "Invalid option" });
//     }

//     // increment and save
//     poll.options[optionIndex].votes += 1;
//     await poll.save();

//     return res.status(201).json({ updatedPoll: poll });
//   } catch (err) {
//     console.error("POST /poll/:id/vote error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;

// ***************************************************************************** //

import express from "express";
import Poll from "../../models/Poll.js";

const router = express.Router();

// GET LATEST POLL
router.get("/", async (req, res) => {
  try {
    // accept either voterId or voterID to be tolerant
    const voterId = req.query.voterId ?? req.query.voterID ?? null;

    const poll = await Poll.findOne().sort({ createdAt: -1 });
    if (!poll) return res.status(200).json(null);

    const hasVoted = voterId ? (Array.isArray(poll.voters) && poll.voters.includes(voterId)) : false;

    // copy and hide votes if user hasn't voted
    const responsePoll = poll.toObject();
    if (!hasVoted) {
      responsePoll.options = responsePoll.options.map(opt => ({
        text: opt.text,
        votes: null
      }));
    }

    // return the transformed object
    return res.status(200).json({ responsePoll });
  } catch (err) {
    console.error("GET /poll error:", err);
    return res.status(500).json({ message: "Server error", err });
  }
});

// CREATE POLL (ADMIN)
router.post("/", async (req, res) => {
  try {
    const adminToken = req.get("x-admin-token");
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { question, options } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "question required" });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "At least 2 options required" });
    }

    const poll = await Poll.create({
      question: question.trim(),
      options: options.map(opt => ({ text: opt.trim(), votes: 0 })),
      voters: []
    });

    return res.status(201).json({ poll });
  } catch (err) {
    console.error("POST /poll error:", err);
    return res.status(500).json({ message: "Server error", err });
  }
});

// VOTE ON POLL
router.post("/:id/vote", async (req, res) => {
  try {
    // tolerate either property name from client: voterId (preferred) or voterID
    let { optionIndex } = req.body;
    const voterId = req.body.voterId ?? req.body.voterID ?? null;

    // coerce optionIndex to integer safely
    optionIndex = Number(optionIndex);
    console.log("VOTE received body:", req.body, "parsed optionIndex:", optionIndex, "voterId:", voterId);

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // validate optionIndex
    if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    // validate voter id
    if (!voterId) {
      return res.status(400).json({ message: "Voter ID required" });
    }

    // prevent double voting
    if (Array.isArray(poll.voters) && poll.voters.includes(voterId)) {
      return res.status(400).json({ message: "Already voted" });
    }

    // ensure voters array exists
    if (!Array.isArray(poll.voters)) poll.voters = [];

    // increment votes and save
    poll.options[optionIndex].votes = (poll.options[optionIndex].votes || 0) + 1;
    poll.voters.push(voterId);
    await poll.save();

    return res.status(201).json({ updatedPoll: poll });
  } catch (err) {
    console.error("POST /poll/:id/vote error:", err);
    return res.status(500).json({ message: "Server error", err });
  }
});

export default router;