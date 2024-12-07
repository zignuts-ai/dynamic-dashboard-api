const express = require("express");

// Policies
// const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const ChatGptController = require("../../controllers/chatgpt/ChatGptController");

// Routes for controllers
router.get("/getKeywords", ChatGptController.getKeywords);
router.get("/getRecentNews", ChatGptController.getRecentNews);

// Export routes
module.exports = router;
