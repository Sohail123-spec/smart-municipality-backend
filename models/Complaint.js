const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    description: String,
    ward: String,

    geoLocation: {
      lat: Number,
      lng: Number,
    },

    image: String,

    status: {
      type: String,
      default: "Pending",
    },

    assignedWorker: {
      type: String,
      default: null,
    },

    /* ✅ NEW: Worker Proof Upload */
    completionImage: {
      type: String,
      default: "",
    },

    /* ✅ NEW: Worker Proof Location */
    workerGeoLocation: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);