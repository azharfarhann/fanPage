import express from "express";
import VisitCount from "../../models/VisitCount.js"
import kohliData from "../../data/kohliStats.json" with { type: "json" };

const router = express.Router();

// GET: Kohli stats + visit count
router.get("/stats", async (req, res) => {
  try {
    let doc = await VisitCount.findOne({ key: "kohliPage" });

    if (!doc) {
      doc = await VisitCount.create({ key: "kohliPage", count: 1 });
    } else {
      doc.count = doc.count + 1;
      await doc.save();
    }

    return res.status(200).json({
      msg: "Kohli stats.",
      stats: kohliData,
      visits: doc.count,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Could not get Kohli stats." });
  }
});

export default router;
