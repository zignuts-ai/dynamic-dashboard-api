// Import express
const express = require('express');

// Import routers
const ChatGptRoutes = require('./chatGptRoutes');

// Create router
const Router = express.Router();

// Use routers
Router.use('/', ChatGptRoutes);

// Export routers
module.exports = Router;