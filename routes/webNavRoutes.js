const express = require('express');
const router = express.Router();
const {
  getNavItems,
  addNavItem,
  updateNavItem,
  deleteNavItem,
} = require('../controllers/webNavController');

// RESTful API endpoints for navigation items
router.get('/', getNavItems);
router.post('/', addNavItem);
router.put('/:id', updateNavItem);
router.delete('/:id', deleteNavItem);

module.exports = router;
