const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// @desc    Add a new comment to a specific blog post
// @route   POST /api/blogs/:id/comments
// @access  Public
exports.addComment = async (req, res) => {
    // Note: 'id' here is the Blog ID, captured from the route parameters.
    const { id } = req.params; 
    const { name, comment } = req.body;

    // Validate that the blog ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Blog ID format.' });
    }

    // Basic input validation
    if (!name || !comment) {
        return res.status(400).json({ message: 'Name and comment content are required.' });
    }

    try {
        const newComment = new Comment({
            blog: id, // Link the comment to the Blog ID
            name,
            comment,
        });

        // Save the new comment document to the separate 'comments' collection
        await newComment.save();
        
        // Respond with the newly created comment object
        res.status(201).json(newComment);

    } catch (error) {
        console.error('Error adding comment:', error);
        // Handle validation errors (e.g., minimum length not met)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to submit comment due to a server error.' });
    }
};

// @desc    Get all comments for a specific blog post
// @route   GET /api/blogs/:id/comments
// @access  Public
exports.getCommentsByBlogId = async (req, res) => {
    // Note: 'id' here is the Blog ID.
    const { id } = req.params; 

    // Validate that the blog ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Blog ID format.' });
    }

    try {
        // Find all comments where the 'blog' field matches the ID
        // Sort by 'date' descending (-1) to show newest comments first
        const comments = await Comment.find({ blog: id }).sort({ date: -1 }); 

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments due to a server error.' });
    }
};
