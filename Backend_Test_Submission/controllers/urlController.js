const express = require("express");
const Url = require("../models/urls");
const router = express.Router();
const shortid = require("shortid");
const validator = require("validator");

const createUrls = async (req, res) => {
  const { originalUrl, validity, shortcode } = req.body;

  if (
    !originalUrl ||
    !validator.isURL(originalUrl, { require_protocol: true })
  ) {
    return res.status(400).json({
      error: "Invalid or miss URL. Please provide a full URL with https://",
    });
  }

  try {
    let uniqueshortcode = shortcode;
    if (shortcode) {
      const existingUrl = await Url.findOne({ shortcode });
      if (existingUrl) {
        return res
          .status(409)
          .json({ error: `The shortcode '${shortcode}' is already in use.` });
      }
    } else {
      uniqueshortcode = shortid.generate();
    }

    const validityMinutes = validity || 30; // Default to 30 mint
    const exp_Date = new Date();
    exp_Date.setMinutes(exp_Date.getMinutes() + validityMinutes);

    const newUrl = new Url({
      originalUrl,
      shortcode: uniqueshortcode,
      exp_Date: exp_Date,
    });

    await newUrl.save();

    const full_Link = `${req.protocol}://${req.get("host")}/${uniqueshortcode}`;
    const formattedExpiry = newUrl.exp_Date.toISOString();

    res.status(201).json({
      shortLink: full_Link,
      expiry: formattedExpiry,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

const getUrls = async (req, res) => {
  const { shortcode } = req.params;

  try {
    const url = await Url.findOne({ shortcode });

    if (!url) {
      return res.status(404).send("Shortened URL not found.");
    }

    if (url.exp_Date < new Date()) {
      return res.status(410).send("Shortened URL has expired.");
    }

    url.totalClicks++;
    url.clickData.push({
      timestamp: new Date(),
      source: req.headers["user-agent"] || "Unknown",
      geoLocation: "Unknown",
    });
    await url.save();

    res.status(200).json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiryDate: url.exp_Date,
      totalClicks: url.totalClicks,
      detailedClicks: url.clickData.map((click) => ({
        timestamp: click.timestamp,
        source: click.source,
        geoLocation: click.geoLocation,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
};
module.exports = { createUrls, getUrls };
