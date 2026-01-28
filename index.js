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

/* ✅ FIX 4: Render PORT Binding */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server Running on Port ${PORT}`);
});