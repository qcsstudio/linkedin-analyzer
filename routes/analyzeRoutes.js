const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  uploadAndExtract,
  getScore,
  getSuggestions,
  uploadProfileData,
} = require("../controllers/analyzeController");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Upload PDF (free)
router.post("/upload", upload.single("pdf"), uploadAndExtract);
router.post("/url", uploadProfileData);

// Score API (free)
router.post("/score", getScore);

// Suggestions (PAID + AUTH)
router.post("/suggestions", authMiddleware, getSuggestions);

module.exports = router;
