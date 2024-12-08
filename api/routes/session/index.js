// Import express
const express = require('express');

// Import routers
const SessionRouter = require('./sessionRoutes');

// Create router
const Router = express.Router();

// Use routers
Router.use('/', SessionRouter);

// Export routers
module.exports = Router;
