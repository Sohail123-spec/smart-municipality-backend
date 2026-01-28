const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");



/* ✅ POST Complaint (Citizen Submits Complaint) */
router.post("/", async (req, res) => {
  try {
    const { title, category, description, ward, geoLocation, image } = req.body;

    const newComplaint = new Complaint({
      title,
      category,
      description,
      ward,
      geoLocation,
      image,
    });

    const savedComplaint = await newComplaint.save();

    res.status(201).json(savedComplaint);
  } catch (error) {
    console.log("❌ Complaint Submit Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



/* ✅ GET ALL COMPLAINTS (FIXED FOR MONGODB MEMORY LIMIT) */
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(200); // ✅ FIX prevents Render crash

    res.status(200).json(complaints);
  } catch (error) {
    console.log("❌ Fetch Complaints Error:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});



/* ✅ GET COMPLAINT BY ID (Citizen Status Tracking) */
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ message: "Invalid Complaint ID" });
  }
});



/* ✅ PATCH COMPLAINT (Admin Updates Status + Worker Uploads Proof) */
router.patch("/:id", async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body, // ✅ allows updating only sent fields
      },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.log("❌ Complaint Update Error:", error);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});



module.exports = router;