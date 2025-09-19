const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { logMiddleware } = require("../Logging_middleware/logger");

const urlRoutes = require("./routes/urlRoutes");

const app = express();
app.use(logMiddleware);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => {
    console.log("Error:", err);
  });

app.get("/", (req, res) => {
  res.send("I'm Running. . .!");
});

app.use("/api/v1/urls", urlRoutes);

app.use((err, req, res, next) => {
  logger.error({
    message: "Server Error",
    error: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });
  res.status(500).json({
    error: "An internal server error occurred. Please try again later.",
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
