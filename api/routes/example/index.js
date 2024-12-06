// Import express
const express = require('express');

// Import routers
const StorageRouter = require('./storageRoutes');

// Create router
const Router = express.Router();

// Use routers
Router.use('/file', StorageRouter);

// Export routers
module.exports = Router;
