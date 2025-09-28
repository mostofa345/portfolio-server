const mongoose = require('mongoose');

// Define the schema for a project tag
const ProjectNavSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required.'],
    unique: true,
    trim: true,
  },
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

const ProjectNav = mongoose.model('ProjectNav', ProjectNavSchema);

module.exports = ProjectNav;
