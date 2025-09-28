// server/controllers/portfolioController.js

const Portfolio = require('../models/Portfolio');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary থেকে ইমেজ ডিলিট করার ফাংশন
const deleteCloudinaryImages = (images) => {
    images.forEach(item => {
        if (item.publicId) {
            cloudinary.uploader.destroy(item.publicId);
        }
    });
};

// --- নতুন যোগ করা ফাংশন: ১. সমস্ত পোর্টফোলিও আনা ---
exports.getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort({ createdAt: -1 });
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch portfolios.", error: error.message });
    }
};

// --- নতুন যোগ করা ফাংশন: ২. আইডি অনুযায়ী একটি পোর্টফোলিও আনা ---
exports.getPortfolioById = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio project not found" });
        }
        res.status(200).json(portfolio);
    } catch (error) {
        // যদি invalid ID ফরম্যাট হয়
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: "Portfolio project not found" });
        }
        res.status(500).json({ message: "Failed to fetch portfolio.", error: error.message });
    }
};


// Create a new portfolio project (ফাইল আপলোড সহ)
exports.createPortfolio = async (req, res) => {
    const { title, githubLink, liveLink, imageDetails } = req.body;
    
    let parsedDetails = [];
    try {
        parsedDetails = JSON.parse(imageDetails);
    } catch (e) {
        return res.status(400).json({ message: 'Invalid imageDetails format.' });
    }

    const uploadedFiles = req.files || [];
    let portfolioImages = [];
    
    try {
        portfolioImages = uploadedFiles.map((file, index) => {
            const details = parsedDetails[index] || {};
            // ডেটাবেসে সেভ করার জন্য imageDetails এ থাকা ডেটা ব্যবহার করা
            return {
                imageTitle: details.imageTitle,
                imageDesc: details.imageDesc,
                imageTech: details.imageTech,
                imageUrl: file.path,      // Cloudinary URL/Path
                publicId: file.filename,  // Cloudinary public_id
            };
        });

        const newPortfolio = new Portfolio({
            title,
            githubLink,
            liveLink,
            images: portfolioImages,
        });
        
        const savedPortfolio = await newPortfolio.save();
        res.status(201).json(savedPortfolio);

    } catch (error) {
        console.error("Create Error:", error);
        // সেভ ব্যর্থ হলে আপলোড করা ফাইলগুলি ডিলিট করা
        deleteCloudinaryImages(portfolioImages);
        res.status(400).json({ message: "Failed to create portfolio project.", error: error.message });
    }
};


// Update a portfolio project (নতুন ফাইল আপলোড এবং পুরনো ফাইল ডিলিট)
exports.updatePortfolio = async (req, res) => {
    const { title, githubLink, liveLink, imageDetails, existingImages } = req.body;
    const portfolioId = req.params.id;
    const newUploadedFiles = req.files || [];
    
    let parsedDetails = [];
    try {
        parsedDetails = JSON.parse(imageDetails);
    } catch (e) {
        deleteCloudinaryImages(newUploadedFiles.map(file => ({ publicId: file.filename })));
        return res.status(400).json({ message: 'Invalid imageDetails format.' });
    }

    let existingImagesParsed = [];
    try {
        existingImagesParsed = existingImages ? JSON.parse(existingImages) : [];
    } catch (e) {
        deleteCloudinaryImages(newUploadedFiles.map(file => ({ publicId: file.filename })));
        return res.status(400).json({ message: 'Invalid existingImages format.' });
    }

    // নতুন আপলোড করা ফাইলগুলির জন্য ইমেজ আইটেম তৈরি করা
    const newImageItems = newUploadedFiles.map((file, index) => {
        // নতুন ইমেজগুলির ডেটা, existingImagesParsed এর পরের ইন্ডেক্স থেকে শুরু হবে
        const details = parsedDetails[existingImagesParsed.length + index] || {}; 
        return {
            imageTitle: details.imageTitle,
            imageDesc: details.imageDesc,
            imageTech: details.imageTech,
            imageUrl: file.path,
            publicId: file.filename,
        };
    });

    const updatedImages = [...existingImagesParsed, ...newImageItems];
    
    try {
        const oldPortfolio = await Portfolio.findById(portfolioId);
        if (!oldPortfolio) {
            deleteCloudinaryImages(newImageItems); 
            return res.status(404).json({ message: 'Portfolio project not found' });
        }

        // ডিলিট করার জন্য ইমেজ খুঁজে বের করা (যেগুলো পুরনো ডেটাবেসে ছিল কিন্তু নতুন আপডেটে নেই)
        const imagesToDelete = oldPortfolio.images.filter(
            oldImg => !updatedImages.some(newImg => newImg.publicId === oldImg.publicId)
        );
        
        // Cloudinary থেকে ডিলিট করা
        deleteCloudinaryImages(imagesToDelete);

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(
            portfolioId,
            { title, githubLink, liveLink, images: updatedImages },
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedPortfolio);

    } catch (error) {
        console.error("Update Error:", error);
        // আপডেটে ব্যর্থ হলে নতুন আপলোড করা ফাইলগুলি ডিলিট করা
        deleteCloudinaryImages(newImageItems); 
        res.status(400).json({ message: "Failed to update portfolio project.", error: error.message });
    }
};


// Delete a portfolio project
exports.deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
        if (!portfolio) return res.status(404).json({ message: "Portfolio project not found" });

        // ডিলিট করার আগে Cloudinary থেকে ইমেজগুলি ডিলিট করা
        deleteCloudinaryImages(portfolio.images);

        res.status(200).json({ message: "Portfolio project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete portfolio project.", error: error.message });
    }
};