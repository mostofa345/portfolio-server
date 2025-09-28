const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        trim: true,
    },
    iconName: {
        type: String,
        required: [true, 'Icon name is required'],
        trim: true,
    },
    priceRange: {
        type: String,
        required: [true, 'Price range is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    coverImageUrl: {
        type: String,
        required: [true, 'Cover image URL is required'],
    },
    cloudinaryPublicId: { // Cloudinary-তে ইমেজ ডিলিট করার জন্য প্রয়োজন
        type: String,
        required: false,
    },
    features: {
        type: [String], // Array of strings
        default: [],
    },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;