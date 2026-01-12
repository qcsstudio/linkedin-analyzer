const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { applyCoupon } = require("../controllers/couponController");

router.post("/apply", authMiddleware, applyCoupon);

module.exports = router;
