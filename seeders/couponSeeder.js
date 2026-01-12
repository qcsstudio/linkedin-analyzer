require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Coupon = require("../models/Coupon");

const coupons = [
  {
    code: "QCSTART7",
   description: "7 days free trial by Quantum Crafter",
    durationDays: 7,
    valid: true
  }
];

const seedCoupons = async () => {
  try {
    await connectDB();

    for (const coupon of coupons) {
      const exists = await Coupon.findOne({ code: coupon.code });

      if (!exists) {
        await Coupon.create(coupon);
        console.log(`Coupon ${coupon.code} created`);
      } else {
        console.log(`Coupon ${coupon.code} already exists`);
      }
    }

    console.log("Coupon seeding finished");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCoupons();
