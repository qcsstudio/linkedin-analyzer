require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const analyzeRoutes = require("./routes/analyzeRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentWebhookRoute = require("./routes/paymentWebhookRoute"); // ✅ ADD

const app = express();

/* 🔔 Razorpay webhook MUST be raw */
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

/* normal middlewares */
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

connectDB();

/* routes */
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment", paymentWebhookRoute); // ✅ ADD

app.get("/", (req, res) => {
  res.send("LinkedIn Analyzer API Running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
