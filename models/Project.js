const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  // নতুন যোগ করা হয়েছে
  description: {
    type: String,
    required: false, // অথবা true, তোমার প্রয়োজন অনুযায়ী
  },
  githubLink: {
    type: String,
    required: true,
  },
  liveLink: {
    type: String,
    required: true,
  },
  // required: false করা হয়েছে যাতে ছবি আপলোড না করলেও সেভ হয়
  images: [{
    type: String,
    required: false, 
  }],
  category: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);