const express = require("express");

// Policies
const { checkUserOrGuest } = require("../../policies/isUser");

// Routes
const router = express.Router();

// Controllers
const SessionController = require("../../controllers/storages/storagesController");

// Routes for controllers
router.get("/:filename", SessionController.getStroage);

// Export routes
module.exports = router;
