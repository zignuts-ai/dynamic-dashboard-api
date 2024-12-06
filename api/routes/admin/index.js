// Import express
const express = require('express');

// Import routers
const AdminAuthRouter = require('./authRoutes');

// Create router
const Router = express.Router();

// Use routers
Router.use('/', AdminAuthRouter);

// Export routers
module.exports = Router;
