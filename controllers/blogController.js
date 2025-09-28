const Blog = require('../models/Blog');
const Comment = require('../models/Comment'); // Import the new Comment model
const mongoose = require('mongoose'); // Import mongoose for ID validation

// 1. Get All Blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }); // Sort by newest first
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
    }
};

// 2. Get Single Blog by ID
exports.getBlogById = async (req, res) => {
    try {
        // Ensure to include comments when fetching the single blog (optional, but good practice)
        const blog = await Blog.findById(req.params.id); 
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        // Handle invalid MongoDB ID format errors gracefully
        if (error.name === 'CastError') {
             return res.status(404).json({ message: "Invalid Blog ID format." });
        }
        res.status(500).json({ message: "Failed to fetch blog", error: error.message });
    }
};

// 3. Create a New Blog
exports.createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: "Failed to create blog", error: error.message });
    }
};

// 4. Update a Blog
exports.updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found for update" });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: "Failed to update blog", error: error.message });
    }
};

// 5. Delete a Blog
exports.deleteBlog = async (req, res) => {
    try {
        // We might want to also delete all associated comments here
        // await Comment.deleteMany({ blog: req.params.id }); 
        
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found for deletion" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete blog", error: error.message });
    }
};


// --- NEW COMMENT LOGIC (to fix the 404 error) ---

// 6. Add a new comment to a specific blog post
// @route   POST /api/blogs/:id/comments
exports.addComment = async (req, res) => {
    const { id } = req.params; // Blog ID
    const { name, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Blog ID format.' });
    }

    if (!name || !comment) {
        return res.status(400).json({ message: 'Name and comment content are required.' });
    }

    try {
        // Check if the blog post actually exists before adding the comment
        const blogExists = await Blog.findById(id).select('_id');
        if (!blogExists) {
            return res.status(404).json({ message: 'Blog post not found. Cannot add comment.' });
        }

        const newComment = new Comment({
            blog: id, // Link the comment to the Blog ID
            name,
            comment,
        });

        await newComment.save();
        
        res.status(201).json(newComment);

    } catch (error) {
        console.error('Error adding comment:', error);
        if (error.name === 'ValidationError') {
            // Send back detailed validation errors for the user
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Failed to submit comment due to a server error.' });
    }
};

// 7. Get all comments for a specific blog post
// @route   GET /api/blogs/:id/comments
exports.getCommentsByBlogId = async (req, res) => {
    const { id } = req.params; // Blog ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Blog ID format.' });
    }

    try {
        // Find all comments for the given blog ID, sorted by newest first
        const comments = await Comment.find({ blog: id }).sort({ date: -1 }); 

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments due to a server error.' });
    }
};
