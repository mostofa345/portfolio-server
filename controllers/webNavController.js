const WebNav = require('../models/webNav');

// Get all navigation items
exports.getNavItems = async (req, res) => {
  try {
    const navItems = await WebNav.find().sort({ createdAt: 1 });
    res.status(200).json(navItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching navigation items', error: error.message });
  }
};

// Add a new navigation item
exports.addNavItem = async (req, res) => {
  try {
    const { name, url } = req.body;
    if (!name || !url) {
      return res.status(400).json({ message: 'Please provide both name and url' });
    }
    const newNavItem = new WebNav({ name, url });
    await newNavItem.save();
    res.status(201).json({ message: 'Navigation item added successfully', navItem: newNavItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding navigation item', error: error.message });
  }
};

// Update an existing navigation item
exports.updateNavItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;
    const updatedItem = await WebNav.findByIdAndUpdate(
      id,
      { name, url },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Navigation item not found' });
    }
    res.status(200).json({ message: 'Navigation item updated successfully', navItem: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating navigation item', error: error.message });
  }
};

// Delete a navigation item
exports.deleteNavItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await WebNav.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Navigation item not found' });
    }
    res.status(200).json({ message: 'Navigation item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting navigation item', error: error.message });
  }
};
