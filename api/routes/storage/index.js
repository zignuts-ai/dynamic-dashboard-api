// Import express
const express = require("express");

// Import routers
const StorageRoutes = require("./StorageRoutes");

// Create router
const Router = express.Router();

// Use routers
Router.use("/", StorageRoutes);

// Export routers
module.exports = Router;
