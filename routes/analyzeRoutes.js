// analyzeRoutes.js
const express = require("express");
const router = express.Router();
const { uploadProfileData, getSuggestions } = require("../controllers/analyzeController");
const { planMiddleware } = require("../middleware/planMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST JSON route
router.post("/url", uploadProfileData);

// authenticated suggestions
router.post("/suggestions", authMiddleware, planMiddleware, getSuggestions);

module.exports = router;
