// controllers/messageController.js

const Message = require('../models/Message');

// @route   POST /api/messages/contact
// @desc    Create a new contact message from client
// @access  Public
exports.createMessage = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, subject, message } = req.body;

    // Basic validation
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const newMessage = new Message({
      fullName,
      email,
      phoneNumber,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({ 
        success: true, 
        message: 'Your message has been sent successfully!', 
        data: newMessage 
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not send message.' });
  }
};


// @route   GET /api/messages
// @desc    Get all messages (for admin panel)
// @access  Private (Requires Admin Auth in a real app)
exports.getMessages = async (req, res) => {
  try {
    // Sort by creation date (newest first)
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({ 
        success: true, 
        count: messages.length, 
        data: messages 
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not fetch messages.' });
  }
};


// @route   DELETE /api/messages/:id
// @desc    Delete a message (for admin panel)
// @access  Private (Requires Admin Auth in a real app)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({ 
        success: true, 
        message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not delete message.' });
  }
};

// Add updateMessage (e.g., to mark as read) if needed