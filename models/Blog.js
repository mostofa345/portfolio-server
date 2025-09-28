// models/Blog.js

const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        default: 'Admin', // Default author if none provided
    },
    date: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String, // Storing image URL
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: [String], // Array of strings for tags
        default: [],
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Blog', BlogSchema);