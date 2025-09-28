const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for nested routes
const { addComment, getCommentsByBlogId } = require('../controllers/commentControllers');

// This router assumes it will be mounted under an existing route like '/api/blogs/:id'
// For example, if mounted like: router.use('/:id', commentRoutes); 
// the full paths will be:
// POST /:id/comments --> To add a comment to blog ID :id
router.post('/comments', addComment);

// GET /:id/comments --> To retrieve all comments for blog ID :id
router.get('/comments', getCommentsByBlogId);

module.exports = router;

/* --- INTEGRATION ADVICE ---

In your main blog route file (e.g., server/routes/blogRoutes.js), 
you would typically integrate this using mergeParams:

const commentRoutes = require('./commentRoutes');

router.use('/:id', commentRoutes); 

This setup allows the comment routes to inherit the ':id' parameter (the Blog ID).
*/
