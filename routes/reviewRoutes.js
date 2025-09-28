// server/routes/reviewRoutes.js

const express = require('express');

// মডেলে module.exports ব্যবহার করায় এখানে require ব্যবহার করা হয়েছে
const Review = require('../models/Review.js'); 

const router = express.Router();

// Route 1: সার্ভিস ID অনুযায়ী সব রিভিউ আনুন (GET /api/reviews/:serviceId)
router.get('/:serviceId', async (req, res) => {
    try {
        const reviews = await Review.find({ serviceId: req.params.serviceId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route 2: নতুন রিভিউ সাবমিট করুন (POST /api/reviews)
router.post('/', async (req, res) => {
    const { serviceId, name, reviewText, rating } = req.body;

    // Validation 
    if (!serviceId || !name || !reviewText || !rating) {
        return res.status(400).json({ message: 'Please provide serviceId, name, reviewText, and rating.' });
    }

    const newReview = new Review({
        serviceId,
        name,
        reviewText,
        rating,
    });

    try {
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// CommonJS export
module.exports = router;