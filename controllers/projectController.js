const Project = require('../models/Project'); // আপনার মডেলটি ধরলাম
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration from your .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.', error: err.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to find project.', error: err.message });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  const { title, shortDescription, description, githubLink, liveLink, category, tags } = req.body;
  
  // 🔥🔥🔥 ফিক্সড: file.url এর বদলে file.path ব্যবহার করা হলো 🔥🔥🔥
  const imageUrls = req.files.map(file => file.path); 
  
  const newProject = new Project({
    title,
    shortDescription,
    description,
    githubLink,
    liveLink,
    images: imageUrls, // এখন এটিতে সঠিক Cloudinary URL সেভ হবে
    category,
    tags: tags ? JSON.parse(tags) : [],
  });
  
  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    // If saving fails, delete uploaded images from Cloudinary
    imageUrls.forEach(url => {
      // Public ID পেতে URL থেকে ফোল্ডারের নাম বাদ দেওয়া দরকার
      const publicId = url.split('/').pop().split('.')[0];
      cloudinary.uploader.destroy(`portfolio-projects/${publicId}`); // Assuming folder name is 'portfolio-projects'
    });
    res.status(400).json({ message: 'Failed to create project.', error: err.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  const { title, shortDescription, description, githubLink, liveLink, category, tags } = req.body;
  
  // 🔥🔥🔥 ফিক্সড: file.url এর বদলে file.path ব্যবহার করা হলো 🔥🔥🔥
  const newImages = req.files ? req.files.map(file => file.path) : [];

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Combine old images with new ones
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const updatedImages = [...existingImages, ...newImages];
    
    // Check which images were removed and delete them from Cloudinary
    // Note: Public ID extract logic needs to be robust (usually folder/publicId)
    const imagesToDelete = project.images.filter(url => !updatedImages.includes(url));
    
    imagesToDelete.forEach(url => {
      const publicIdWithFolder = `portfolio-projects/${url.split('/').pop().split('.')[0]}`; // assuming folder is 'portfolio-projects'
      cloudinary.uploader.destroy(publicIdWithFolder);
    });

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        shortDescription,
        description,
        githubLink,
        liveLink,
        images: updatedImages, // এখন সঠিক URL সেভ হবে
        category,
        tags: tags ? JSON.parse(tags) : project.tags,
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedProject);
  } catch (err) {
    // If update fails, delete newly uploaded images
    newImages.forEach(url => {
      const publicId = url.split('/').pop().split('.')[0];
      cloudinary.uploader.destroy(`portfolio-projects/${publicId}`); // Assuming folder name is 'portfolio-projects'
    });
    res.status(400).json({ message: 'Failed to update project.', error: err.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Delete images from Cloudinary
    project.images.forEach(url => {
      const publicId = url.split('/').pop().split('.')[0];
      cloudinary.uploader.destroy(`portfolio-projects/${publicId}`); // Assuming folder name is 'portfolio-projects'
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project.', error: err.message });
  }
};