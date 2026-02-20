const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");


// ☁ Simulated Cloud AI Decision Function
const getCloudAIDecision = async (type, data) => {
  console.log(`🔍 Forwarding to Cloud AI → Sensor type: ${type}`);

  switch (type) {

    case "garbage": {
      const level = data?.level || 0;

      let priority = "Medium";
      let analysis = "";

      if (level >= 95) {
        priority = "Critical";
        analysis = `Garbage level extremely high at ${level}%`;
      } else if (level >= 90) {
        priority = "High";
        analysis = `Garbage level high at ${level}%`;
      } else if (level >= 80) {
        priority = "Medium";
        analysis = `Garbage level rising at ${level}%`;
      }

      return {
        complaintNeeded: level > 80,
        priority,
        analysis,
      };
    }

    case "water":
      return {
        complaintNeeded: data?.leak === true,
        priority: "Critical",
        analysis: "Water leakage detected",
      };

    case "streetlight": {
      const light = data?.lightLevel;

      let priority = "Medium";
      let analysis = "";

      if (light === 0) {
        priority = "High";
        analysis = "Streetlight failure detected (no light)";
      }

      return {
        complaintNeeded: light === 0,
        priority,
        analysis,
      };
    }

    case "drainage": {
      const level = data?.level || 0;

      let priority = "Medium";
      let analysis = "";

      if (level >= 95) {
        priority = "Critical";
        analysis = `Drainage overflow risk at ${level}%`;
      } else if (level >= 85) {
        priority = "High";
        analysis = `Drainage level high at ${level}%`;
      }

      return {
        complaintNeeded: level > 85,
        priority,
        analysis,
      };
    }

    default:
      return {
        complaintNeeded: false,
        priority: "Low",
        analysis: "Unknown sensor type",
      };
  }
};


// 📡 SENSOR DATA ENDPOINT
router.post("/sensor-data", async (req, res) => {
  try {
    console.log("📡 Sensor Data Received:");
    console.log(JSON.stringify(req.body, null, 2));

    const { sensors, type, data, location } = req.body;

    if (!type && !sensors) {
      return res.status(400).json({
        message: "Sensor type required",
      });
    }

    const sensorList = sensors || [{ type, data, location }];

    for (const sensor of sensorList) {
      const { type, data, location } = sensor;

      console.log(`\n🧪 Processing sensor → ${type}`);

      // ☁ Cloud AI Decision
      const aiDecision = await getCloudAIDecision(type, data);

      console.log("☁ Cloud AI Decision:", aiDecision);

      if (!aiDecision.complaintNeeded) {
        console.log(`✅ No complaint needed for ${type}`);
        continue;
      }

      let complaintDetails = {};

      switch (type) {
        case "garbage":
          complaintDetails = {
            title: "Garbage Bin Overflow",
            description: aiDecision.analysis,
            category: "Garbage",
          };
          break;

        case "water":
          complaintDetails = {
            title: "Water Leakage Detected",
            description: aiDecision.analysis,
            category: "Water",
          };
          break;

        case "streetlight":
          complaintDetails = {
            title: "Street Light Failure",
            description: aiDecision.analysis,
            category: "Street Light",
          };
          break;

        case "drainage":
          complaintDetails = {
            title: "Drainage Overflow",
            description: aiDecision.analysis,
            category: "Drainage",
          };
          break;

        default:
          console.log("⚠ Unknown sensor type:", type);
          continue;
      }

      console.log("🧪 Checking duplicates...");

      // 🔍 Duplicate Prevention
      const existingComplaint = await Complaint.findOne({
        title: complaintDetails.title,
        location,
        status: { $ne: "Resolved" },
        source: "IoT Sensor",
      });

      if (existingComplaint) {
        console.log("♻ Duplicate detected → Updating existing complaint");

        existingComplaint.description = complaintDetails.description;
        existingComplaint.priority = aiDecision.priority;
        existingComplaint.updatedAt = new Date();

        await existingComplaint.save();

        console.log("✅ Existing complaint UPDATED:", existingComplaint.title);

      } else {
        console.log("🆕 No duplicate → Creating new complaint");

        const newComplaint = new Complaint({
          ...complaintDetails,
          location,
          status: "Submitted",
          priority: aiDecision.priority,
          source: "IoT Sensor",
          createdAt: new Date(),
        });

        const savedComplaint = await newComplaint.save();

        console.log("✅ Complaint CREATED:", savedComplaint.title);
      }
    }

    res.status(200).json({
      message: "Sensor data processed successfully",
    });

  } catch (err) {
    console.error("🔥 SENSOR ROUTE ERROR:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;