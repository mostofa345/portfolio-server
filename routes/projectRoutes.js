const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration from your .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-projects',
    format: async (req, file) => 'png',
    public_id: (req, file) => `${file.originalname}-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

// GET all projects
router.get('/', projectController.getProjects);

// GET a single project by ID
router.get('/:id', projectController.getProjectById);

// POST a new project with image upload
router.post('/', upload.array('images', 10), projectController.createProject);

// PUT/PATCH to update a project with image upload
router.put('/:id', upload.array('images', 10), projectController.updateProject);

// DELETE a project
router.delete('/:id', projectController.deleteProject);

module.exports = router;