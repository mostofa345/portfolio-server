// server/middleware/upload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration: .env ফাইল থেকে ডেটা লোড করুন
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage তৈরি করা
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_images', // Cloudinary-তে যে ফোল্ডারে সেভ হবে
        format: async (req, file) => 'jpeg', // ফাইল ফরম্যাট সেট করা
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
    },
});

// Multer মিডলওয়্যার তৈরি করা
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;