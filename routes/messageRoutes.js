// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { createMessage, getMessages, deleteMessage } = require('../controllers/messageController');

// Client site route: POST request to submit a message
router.post('/contact', createMessage);

// Admin routes (assuming /api/messages is the base)
router.get('/', getMessages);
router.delete('/:id', deleteMessage);

module.exports = router;