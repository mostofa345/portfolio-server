const ProjectNav = require('../models/projectNavModel');

// Get all project tags
exports.getProjectTags = async (req, res) => {
  try {
    const tags = await ProjectNav.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project tags', error: error.message });
  }
};

// Create a new project tag
exports.createProjectTag = async (req, res) => {
  try {
    const newTag = new ProjectNav(req.body);
    await newTag.save();
    res.status(201).json({ message: 'Project tag created successfully', projectTag: newTag });
  } catch (error) {
    res.status(400).json({ message: 'Error creating project tag', error: error.message });
  }
};

// Update a project tag
exports.updateProjectTag = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTag = await ProjectNav.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedTag) {
      return res.status(404).json({ message: 'Project tag not found' });
    }
    res.status(200).json({ message: 'Project tag updated successfully', projectTag: updatedTag });
  } catch (error) {
    res.status(400).json({ message: 'Error updating project tag', error: error.message });
  }
};

// Delete a project tag
exports.deleteProjectTag = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTag = await ProjectNav.findByIdAndDelete(id);
    if (!deletedTag) {
      return res.status(404).json({ message: 'Project tag not found' });
    }
    res.status(200).json({ message: 'Project tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project tag', error: error.message });
  }
};
