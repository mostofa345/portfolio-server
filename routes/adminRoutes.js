// routes/adminRoutes.js

const express = require('express');
const { loginAdmin, registerAdmin } = require('../controllers/adminController'); // কন্ট্রোলার ইমপোর্ট করা
const router = express.Router();

// -----------------------------------------------------
// 🛑 নিরাপত্তা সতর্কতা: রেজিস্ট্রেশন রুট বন্ধ করা হয়েছে 
// -----------------------------------------------------

// router.post('/register', registerAdmin); 
// উপরে এই রুটটি ব্যবহার করে আপনি একবার অ্যাডমিন তৈরি করে ফেলেছেন।
// তাই এখন এটি কমেন্ট করা বা মুছে ফেলা নিরাপদ।

// -----------------------------------------------------
// ✅ সক্রিয় রুট: অ্যাডমিন লগইন
// -----------------------------------------------------

// 2. লগইন রুট: এটি সবসময় সক্রিয় থাকবে।
// URL: POST /api/admin/login
router.post('/login', loginAdmin);

module.exports = router;