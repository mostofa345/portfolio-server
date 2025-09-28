// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', // Service মডেলকে রেফার করছে
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// CommonJS export
module.exports = Review;