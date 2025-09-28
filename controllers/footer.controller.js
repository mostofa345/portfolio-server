// /server/controllers/footer.controller.js

const Footer = require('../models/Footer.model');

// @route GET /api/footer
// @desc Get all footer items, sorted by type and order
exports.getFooterItems = async (req, res) => {
    try {
        const items = await Footer.find().sort({ type: 1, order: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch footer items.' });
    }
};

// @route POST /api/footer
// @desc Create a new footer item
exports.createFooterItem = async (req, res) => {
    const { type, name, path, icon, href, order } = req.body;

    // Basic validation based on type
    if (type === 'link' && (!name || !path)) {
        return res.status(400).json({ message: 'Link items require a name and path.' });
    }
    if (type === 'social' && (!icon || !href)) {
        return res.status(400).json({ message: 'Social items require an icon and href.' });
    }

    try {
        const newItem = new Footer({
            type,
            name,
            path,
            icon,
            href,
            order: order || 0
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: 'Error creating footer item.', error: err.message });
    }
};

// @route GET /api/footer/:id
// @desc Get a single footer item by ID
exports.getFooterItemById = async (req, res) => {
    try {
        const item = await Footer.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Footer item not found.' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch item.' });
    }
};


// @route PUT /api/footer/:id
// @desc Update an existing footer item
exports.updateFooterItem = async (req, res) => {
    const { type, name, path, icon, href, order } = req.body;

    try {
        const updatedItem = await Footer.findByIdAndUpdate(
            req.params.id,
            { type, name, path, icon, href, order },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Footer item not found.' });
        }
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: 'Error updating footer item.', error: err.message });
    }
};

// @route DELETE /api/footer/:id
// @desc Delete a footer item
exports.deleteFooterItem = async (req, res) => {
    try {
        const deletedItem = await Footer.findByIdAndDelete(req.params.id);
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Footer item not found.' });
        }
        res.json({ message: 'Footer item deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete item.' });
    }
};