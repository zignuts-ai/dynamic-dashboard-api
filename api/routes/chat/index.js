// Import express
const express = require("express");

// Import routers
const chatRoute = require("./chatRoute");

// Create router
const Router = express.Router();

// Use routers
Router.use("/", chatRoute);

// Export routers
module.exports = Router;
