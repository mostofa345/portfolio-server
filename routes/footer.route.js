// /server/routes/footer.route.js

const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footer.controller');

// GET all footer items
router.get('/', footerController.getFooterItems);

// GET a single footer item
router.get('/:id', footerController.getFooterItemById);

// POST a new footer item
router.post('/', footerController.createFooterItem);

// PUT/Update a footer item
router.put('/:id', footerController.updateFooterItem);

// DELETE a footer item
router.delete('/:id', footerController.deleteFooterItem);

module.exports = router;