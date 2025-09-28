const mongoose = require('mongoose');

const webNavSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Navigation name is required'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Navigation URL is required'],
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('WebNav', webNavSchema);
