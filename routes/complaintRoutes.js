const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");


// ✅ POST Complaint (Already Working)
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
    console.log("Complaint Submit Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ GET ALL COMPLAINTS (Safe Fetch Limit)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().limit(50);
    res.status(200).json(complaints);

  } catch (error) {
    console.log("Fetch Complaints Error:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});


// ✅ GET COMPLAINT BY ID
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


// ✅ PATCH Complaint (Status Updates + Proof Upload)
router.patch("/:id", async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }

    res.status(200).json(updatedComplaint);

  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});


// ✅ ✅ NEW FEATURE: PERMANENT DELETE FROM BIN
router.delete("/:id", async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }

    res.status(200).json({
      message: "✅ Complaint Permanently Deleted Successfully",
    });

  } catch (error) {
    console.log("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
});


// ✅ Export Router
module.exports = router;