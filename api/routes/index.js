// Import express
const express = require("express");

// Create router
const Router = express.Router();

const AdminRoutes = require("./admin");
const UserRoutes = require("./user");
const ExampleROutes = require("./example");
const ChatGptRoutes = require("./chatgpt");
const SessionRoutes = require("./session");
const StorageRoutes = require("./storage");

// Use routers
Router.use("/admin", AdminRoutes);
Router.use("/user", UserRoutes);
Router.use("/example", ExampleROutes);
Router.use("/chatgpt", ChatGptRoutes);
Router.use("/session", SessionRoutes);
Router.use("/generatedVideo", StorageRoutes);

// Export routers
module.exports = Router;
