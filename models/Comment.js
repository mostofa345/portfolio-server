const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    // Which blog this comment belongs to (MANDATORY for linking)
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    // Commenter's name
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long.']
    },
    // Comment content
    comment: {
        type: String,
        required: true,
        minlength: [5, 'Comment must be at least 5 characters long.']
    },
    // Date of submission
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('Comment', CommentSchema);
