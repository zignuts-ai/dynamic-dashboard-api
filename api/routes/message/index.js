// Import express
const express = require("express");

// Import routers
const messageRoute = require("./messageRoute");

// Create router
const Router = express.Router();

// Use routers
Router.use("/", messageRoute);

// Export routers
module.exports = Router;
