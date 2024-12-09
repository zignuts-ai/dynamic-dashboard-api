// Import express
const express = require('express');

// Create router
const Router = express.Router();

// Controllers
const AgentController = require('../../controllers/agent/AgentController');

// Routes for controllers
Router.post('/detect-intent', AgentController.testIntent);
Router.post('/generate-keywords', AgentController.generateKeywords);

// Export routers
module.exports = Router;
