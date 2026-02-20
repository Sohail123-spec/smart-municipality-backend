const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

/* ✅ FIX 1: Correct CORS for Vercel */
app.use(
  cors({
    origin: "*", // allow all frontend domains
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* ✅ FIX 2: Body Limits */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

console.log("✅ Trying to connect MongoDB...");

/* ✅ FIX 3: MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

/* ✅ TEST ROUTE */
app.get("/", (req, res) => {
  res.send("✅ Smart Municipality Backend Running Successfully");
});

/* ✅ API ROUTES */
app.use("/api/complaints", complaintRoutes);
const sensorRoutes = require("./routes/sensorRoutes");
app.use("/api", sensorRoutes);
const cloudAIRoutes = require("./routes/cloudAIRoutes");
app.use("/api", cloudAIRoutes);
/* ✅ FIX 4: Render PORT Binding */
const PORT = process.env.PORT || 5000;
// ================= SENSOR DATA API (AI-IoT ENGINE) =================

app.post("/api/sensor-data", async (req, res) => {
  try {
    console.log("📡 Sensor Data Received:", req.body);

    const { type, level, leak, lightLevel, location } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Sensor type required" });
    }

    // ================= AI DECISION LOGIC =================

    let complaintNeeded = false;
    let category = "";
    let priority = "Medium";
    let description = "";

    // 🗑 Garbage Monitoring
    if (type === "garbage" && level >= 80) {
      complaintNeeded = true;
      category = "Garbage";
      priority = level >= 95 ? "Critical" : "High";
      description = `Garbage bin almost/full (Level: ${level}%)`;
    }

    // 💧 Water Leakage Detection
    if (type === "water" && leak === true) {
      complaintNeeded = true;
      category = "Water Leakage";
      priority = "Critical";
      description = "Water leakage detected by IoT sensor";
    }

    // 💡 Street Light Failure
    if (type === "streetlight" && lightLevel === 0) {
      complaintNeeded = true;
      category = "Street Light";
      priority = "Medium";
      description = "Street light not functioning (No light detected)";
    }

    // 🚰 Drainage Overflow
    if (type === "drainage" && level >= 70) {
      complaintNeeded = true;
      category = "Drainage";
      priority = "High";
      description = `Drainage level exceeded threshold (${level}%)`;
    }

    // ================= AUTO COMPLAINT CREATION =================

    if (complaintNeeded) {
      const Complaint = require("./models/Complaint"); // adjust path if needed

      const newComplaint = new Complaint({
        title: `Auto-Generated: ${category} Issue`,
        description,
        category,
        location: location || "Sensor Location",
        status: "Submitted",
        priority,
        source: "AI-IoT System",
        createdAt: new Date(),
      });

      await newComplaint.save();

      console.log("🚨 Complaint Auto-Created:", category);

      return res.status(200).json({
        message: "Complaint automatically generated",
        category,
        priority,
      });
    }

    // ================= NO ISSUE CASE =================

    console.log("✅ No complaint triggered");

    res.status(200).json({
      message: "Sensor data processed – No issue detected",
    });

  } catch (err) {
    console.error("❌ Sensor Processing Error:", err);
    res.status(500).json({ message: "Server error processing sensor data" });
  }
});
app.listen(PORT, () => {
  console.log(`✅ Server Running on Port ${PORT}`);
});
app.post("/api/sensor-data", (req, res) => {
  console.log("Sensor Data Received:", req.body);

  const { type, level, location } = req.body;

  if (!type) {
    return res.status(400).json({ message: "Sensor type required" });
  }

  // Example decision logic
  if (type === "garbage" && level > 80) {
    console.log("🚨 Garbage Complaint Triggered");
  }

  res.status(200).json({
    message: "Sensor data processed successfully",
  });
});