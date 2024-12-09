const express = require('express');


// Routes
const router = express.Router();

// Controllers
const ChatController = require('../../controllers/chat/ChatController');

// policies
const { isGuestUser } = require('../../policies/isGuestUser');

// Routes for controllers
router.post('/create', [isGuestUser], ChatController.create);
router.post('/generate',[isGuestUser], ChatController.chat);

// Export routes
module.exports = router;
