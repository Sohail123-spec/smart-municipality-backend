const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // loads .env file

// Import routes
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

console.log("Trying to connect to MongoDB...");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Base route
app.get("/", (req, res) => {
  res.send("Smart Municipality Backend is running");
});

// Complaint routes
app.use("/api/complaints", complaintRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});