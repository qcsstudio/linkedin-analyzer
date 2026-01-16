require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// routes
const analyzeRoutes = require("./routes/analyzeRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentWebhookRoute = require("./routes/paymentWebhookRoute");

const app = express();

/**
 * 🔐 Razorpay webhook MUST be before body parsers
 * because it needs RAW body for signature verification
 */
app.use("/api/payment/webhook", paymentWebhookRoute);

/**
 * 🌐 Global middlewares
 */
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

/**
 * 🔌 Database
 */
connectDB();

/**
 * 🚀 API Routes
 */
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

/**
 * 🏠 Health check
 */
app.get("/", (req, res) => {
  res.send("LinkedIn Analyzer API Running");
});

/**
 * 🟢 Server
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
