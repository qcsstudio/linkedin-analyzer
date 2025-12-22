const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { planMiddleware } = require("../middleware/planMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadAndExtract,getScore,getSuggestions,uploadProfileData} = require("../controllers/analyzeController");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.post("/url", uploadProfileData);
// Suggestions (PAID + AUTH)
router.post("/suggestions", authMiddleware,planMiddleware,getSuggestions);


module.exports = router;
