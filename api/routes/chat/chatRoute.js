const express = require('express');

// Policies
// const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const ChatController = require('../../controllers/chat/ChatController');
const { isGuestUser } = require('../../policies/isGuestUser');

// Routes for controllers
router.post('/create', [isGuestUser], ChatController.create);
router.post('/generate', ChatController.chat);

// Export routes
module.exports = router;
