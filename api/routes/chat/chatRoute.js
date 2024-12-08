const express = require("express");

// Policies
// const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const ChatController = require("../../controllers/chat/ChatController");

// Routes for controllers
router.get("/create", ChatController.create);

// Export routes
module.exports = router;
