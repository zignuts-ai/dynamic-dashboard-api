// Import express
const express = require('express');

// Import routers
const UserAuthRouter = require('./authRoutes');

// Create router
const Router = express.Router();

// Use routers
Router.use('/', UserAuthRouter);

// Export routers
module.exports = Router;
