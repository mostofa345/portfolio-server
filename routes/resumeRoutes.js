// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// GET all resume items
router.get('/', resumeController.getAllItems);

// POST a new resume item
router.post('/', resumeController.createItem);

// PUT/PATCH to update a resume item
router.put('/:id', resumeController.updateItem);

// DELETE a resume item
router.delete('/:id', resumeController.deleteItem);

module.exports = router;