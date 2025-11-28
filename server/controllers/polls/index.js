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
    const voterID = req.query.voterID;  
    const poll = await Poll.findOne().sort({ createdAt: -1 });

    if (!poll) {
      return res.json(null);
    }

    const hasVoted = voterID ? poll.voters.includes(voterID) : false;

    let responsePoll = poll.toObject();

    // hide vote counts until user votes
    if (!hasVoted) {
      responsePoll.options = responsePoll.options.map(opt => ({
        text: opt.text,
        votes: null
      }));
    }

    res.status(200).json({responsePoll});
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
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

    if (!question || !question.trim()){
            return res.status(400).json({ message: "question required" });

    } 
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "At least 2 options required" });
    }

    const poll = await Poll.create({
      question: question.trim(),
      options: options.map(opt => ({ text: opt.trim(), votes: 0 }))
    });

    return res.status(201).json({poll});
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// VOTE ON POLL
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionIndex, voterID } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (typeof optionIndex !== "number") {
      return res.status(400).json({ message: "Invalid option index" });
    }

    if (!voterID) {
      return res.status(400).json({ message: "Voter ID required" });
    }

    // check double voting
    if (poll.voters.includes(voterID)) {
      return res.status(400).json({ message: "Already voted" });
    }

    // check indexs
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    // vote -> increment & Save
    poll.options[optionIndex].votes += 1;
    poll.voters.push(voterID);
    await poll.save();

    res.status(201).json({poll});
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default router;
