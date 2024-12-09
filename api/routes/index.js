// Import express
const express = require('express');

// Create router
const Router = express.Router();

const UserRoutes = require('./user');
const ExampleROutes = require('./example');
const ChatGptRoutes = require('./chatgpt');
const SessionRoutes = require('./session');
const StorageRoutes = require('./storage');
const MessageRoutes = require('./message');
const ChatRoutes = require('./chat');
const AgentRoutes = require('./agent');

// Use routers
Router.use('/user', UserRoutes);
Router.use('/example', ExampleROutes);
Router.use('/chatgpt', ChatGptRoutes);
Router.use('/session', SessionRoutes);
Router.use('/generatedVideo', StorageRoutes);
Router.use('/message', MessageRoutes);
Router.use('/chat', ChatRoutes);
Router.use('/agent', AgentRoutes);

// Export routers
module.exports = Router;
