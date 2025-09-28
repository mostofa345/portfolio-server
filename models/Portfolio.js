// models/Portfolio.js

const mongoose = require('mongoose');

// নতুন স্কিমা: Image Item-এর জন্য
const ImageItemSchema = new mongoose.Schema({
    imageTitle: { // প্রতিটি ইমেজের জন্য আলাদা টাইটেল
        type: String,
        required: true,
        trim: true
    },
    imageDesc: { // প্রতিটি ইমেজের জন্য আলাদা ডেসক্রিপশন
        type: String,
        required: true,
        trim: true
    },
    imageTech: { // প্রতিটি ইমেজের জন্য ব্যবহৃত টেকনোলজি
        type: String,
        required: true,
        trim: true
    },
    imageUrl: { // Cloudinary/আপলোড করা ইমেজের URL
        type: String,
        required: true
    },
    publicId: { // Cloudinary-তে ইমেজ ডিলিট করার জন্য
        type: String,
        required: true
    }
});

// মূল পোর্টফোলিও স্কিমা
const PortfolioSchema = new mongoose.Schema({
    title: { // মূল প্রজেক্ট টাইটেল (ওভারভিউ)
        type: String,
        required: true,
        trim: true
    },
    images: [ImageItemSchema], // ইমেজ অ্যারে: এখন প্রতিটি একটি অবজেক্ট
    githubLink: {
        type: String,
        default: '#'
    },
    liveLink: {
        type: String,
        default: '#'
    },
    // এখন মূল ডেসক্রিপশন এবং টেকনোলজির প্রয়োজন নেই, কারণ সেগুলি ইমেজের মধ্যে চলে গেছে
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);