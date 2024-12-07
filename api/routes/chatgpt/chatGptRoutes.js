const express = require('express');

// Policies
// const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();



// Controllers
const ChatGptController = require('../../controllers/chatgpt/ChatGptController');

// Routes for controllers
router.get("/getKeywords",  ChatGptController.getKeywords);


// Export routes
module.exports = router;
