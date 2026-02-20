const express = require("express");
const router = express.Router();

// ☁ Cloud AI Decision Engine
router.post("/cloud-ai", async (req, res) => {
  try {
    console.log("☁ Cloud AI Received Sensor Data:");
    console.log(JSON.stringify(req.body, null, 2));

    const { type, data } = req.body;

    let decision = {
      complaintNeeded: false,
      priority: "Low",
      analysis: "Normal conditions"
    };

    switch (type) {

      case "garbage":
        if (data?.level > 80) {
          decision = {
            complaintNeeded: true,
            priority: data.level > 90 ? "High" : "Medium",
            analysis: `Garbage level critical at ${data.level}%`
          };
        }
        break;

      case "water":
        if (data?.leak === true) {
          decision = {
            complaintNeeded: true,
            priority: "Critical",
            analysis: "Water leakage detected"
          };
        }
        break;

      case "streetlight":
        if (data?.lightLevel === 0) {
          decision = {
            complaintNeeded: true,
            priority: "Medium",
            analysis: "Streetlight failure detected"
          };
        }
        break;

      case "drainage":
        if (data?.level > 85) {
          decision = {
            complaintNeeded: true,
            priority: "High",
            analysis: `Drainage overflow risk at ${data.level}%`
          };
        }
        break;
    }

    res.status(200).json(decision);

  } catch (err) {
    console.error("🔥 CLOUD AI ERROR:", err);
    res.status(500).json({
      message: "Cloud AI error",
      error: err.message
    });
  }
});

module.exports = router;