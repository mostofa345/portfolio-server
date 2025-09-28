const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// GET all blogs and POST a new blog
router.route('/')
    .get(blogController.getBlogs)
    .post(blogController.createBlog);

// GET a single blog, PUT/PATCH to update, and DELETE a blog by ID
router.route('/:id')
    .get(blogController.getBlogById)
    .put(blogController.updateBlog) // Use put for full update
    .delete(blogController.deleteBlog);

// --- NEW COMMENT ROUTES (FIXES 404 ERROR) ---
// Routes for handling comments on a specific blog ID: /api/blogs/:id/comments

// POST: Add a new comment
router.post('/:id/comments', blogController.addComment);

// GET: Fetch all existing comments
router.get('/:id/comments', blogController.getCommentsByBlogId);

module.exports = router;
