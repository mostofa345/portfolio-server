// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'], // Basic email validation
    },
    phoneNumber: {
      type: String,
      // required: true, // You can make this optional if needed
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    isRead: { // New field to track if admin has read it
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;