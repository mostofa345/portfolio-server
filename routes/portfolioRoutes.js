// server/routes/portfolioRoutes.js

const express = require('express');
const router = express.Router(); 

// 1. Controller Functions ইমপোর্ট করা
const { 
    createPortfolio, 
    getAllPortfolios, 
    getPortfolioById, 
    updatePortfolio, 
    deletePortfolio 
} = require('../controllers/portfolioController');

// 2. Multer Upload মিডলওয়্যার ইমপোর্ট করা
// নিশ্চিত করুন যে এই পথটি সঠিক, এবং আপনি middleware/upload.js ফাইলটি তৈরি করেছেন
const upload = require('../middleware/upload'); 


// --- Public Routes (ডেটা দেখানোর জন্য) ---
router.get('/', getAllPortfolios); 
router.get('/:id', getPortfolioById); 

// --- Admin Routes (ডেটা যোগ, এডিট ও ডিলিট করার জন্য) ---

// নতুন পোর্টফোলিও যোগ:
router.post(
    '/', 
    upload.array('images'), 
    createPortfolio
); 

// পোর্টফোলিও আপডেট:
router.put(
    '/:id', 
    upload.array('newImages'), 
    updatePortfolio
); 

// পোর্টফোলিও ডিলিট
router.delete(
    '/:id', 
    deletePortfolio
); 

module.exports = router;