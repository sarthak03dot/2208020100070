const mongoose = require("mongoose");

const click_Schema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  geoLocation: {
    type: String,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortcode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  exp_Date: {
    type: Date,
    required: true,
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  clickData: [click_Schema],
});
const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
