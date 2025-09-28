const Service = require('../models/service.model');
const cloudinary = require('cloudinary').v2;

const parseFeatures = (features) => {
    try {
        if (typeof features === 'string') return JSON.parse(features);
        return features || [];
    } catch (e) {
        return [];
    }
};

exports.createService = async (req, res) => {
    try {
        const { title, shortDescription, iconName, priceRange, description } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: "Cover image is required." });

        const features = parseFeatures(req.body.features);

        const newService = new Service({
            title, shortDescription, iconName, priceRange, description,
            features,
            coverImageUrl: file.path,
            cloudinaryPublicId: file.filename,
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create service.", error: error.message });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch services." });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch service." });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { title, shortDescription, iconName, priceRange, description } = req.body;
        const file = req.file;
        const features = parseFeatures(req.body.features);

        const updateData = { title, shortDescription, iconName, priceRange, description, features };
        if (file) {
            updateData.coverImageUrl = file.path;
            updateData.cloudinaryPublicId = file.filename;
        }

        const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedService) return res.status(404).json({ message: "Service not found" });

        res.status(200).json(updatedService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update service." });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        if (service.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(service.cloudinaryPublicId);
        }

        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete service." });
    }
};
