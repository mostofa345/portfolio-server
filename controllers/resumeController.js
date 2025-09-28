// controllers/resumeController.js
const ResumeItem = require('../models/ResumeItem');

// 1. নতুন আইটেম যোগ করুন (Add)
exports.createItem = async (req, res) => {
    try {
        const newItem = new ResumeItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Item creation failed', error: error.message });
    }
};

// 2. সমস্ত আইটেম দেখুন (Get All)
exports.getAllItems = async (req, res) => {
    try {
        // ডেটা ক্যাটাগরি এবং অর্ডার অনুযায়ী সাজিয়ে ফেরত দেবে
        const items = await ResumeItem.find().sort({ category: 1, order: 1, createdAt: 1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
};

// 3. একটি আইটেম আপডেট করুন (Edit)
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await ResumeItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Item update failed', error: error.message });
    }
};

// 4. একটি আইটেম মুছে ফেলুন (Delete)
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await ResumeItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
};