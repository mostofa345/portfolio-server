const router = require('express').Router();
const serviceController = require('../controllers/service.controller');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// --- Cloudinary Configuration ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer + Cloudinary ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_services',
        allowed_formats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

const upload = multer({ storage: storage });

// --- Routes ---
router.route('/')
    .post(upload.single('coverImage'), serviceController.createService)
    .get(serviceController.getAllServices);

router.route('/:id')
    .get(serviceController.getServiceById)
    .put(upload.single('coverImage'), serviceController.updateService)
    .delete(serviceController.deleteService);

module.exports = router;
