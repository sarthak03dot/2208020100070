const express = require("express");
const router = express.Router();
const { createUrls, getUrls } = require("../controllers/urlController");

router.post("/", createUrls);
router.get("/:shortcode", getUrls);
module.exports = router;
