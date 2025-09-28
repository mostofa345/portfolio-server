const express = require('express');
const router = express.Router();
const projectNavController = require('../controllers/projectNavController');

// Get all project tags
router.get('/', projectNavController.getProjectTags);

// Create a new project tag
router.post('/', projectNavController.createProjectTag);

// Update a project tag
router.put('/:id', projectNavController.updateProjectTag);

// Delete a project tag
router.delete('/:id', projectNavController.deleteProjectTag);

module.exports = router;
