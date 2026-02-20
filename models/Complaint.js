const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    description: String,
    ward: String,
    location: {
  type: String,
  default: "Not Provided",
},
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

    /* ✅ Worker Proof Upload */
    completionImage: {
      type: String,
      default: "",
    },

    /* ✅ Worker Proof Location */
    workerGeoLocation: {
      lat: Number,
      lng: Number,
    },

    /* ✅ NEW: Complaint Priority */
    priority: {
      type: String,
      default: "Medium",
    },

    /* ✅ NEW: Complaint Source */
    source: {
      type: String,
      default: "Citizen",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);