// /server/models/Footer.model.js (Assuming Mongoose)

const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
    // Determines if it's a 'link' or 'social' item
    type: {
        type: String,
        enum: ['link', 'social'],
        required: true
    },
    
    // Used for 'link' type (e.g., "About Us")
    name: {
        type: String,
        trim: true,
        required: function() { return this.type === 'link'; } // Required only for link type
    },
    
    // Used for 'link' type (e.g., "/about")
    path: {
        type: String,
        trim: true,
        required: function() { return this.type === 'link'; } // Required only for link type
    },
    
    // Used for 'social' type (e.g., "FaGithub")
    icon: {
        type: String,
        trim: true,
        required: function() { return this.type === 'social'; } // Required only for social type
    },
    
    // Used for 'social' type (e.g., "https://github.com/user")
    href: {
        type: String,
        trim: true,
        required: function() { return this.type === 'social'; } // Required only for social type
    },

    // Optional: for custom sorting on the client-side
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Footer', FooterSchema);