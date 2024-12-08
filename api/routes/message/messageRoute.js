const express = require("express");

// Policies
const { isAdmin } = require("../../policies/isAdmin");

// Routes
const router = express.Router();

// Controllers
const MessageController = require("../../controllers/message/MessageController");

// Routes for controllers
router.post("/create", MessageController.createMessage);

// Export routes
module.exports = router;
