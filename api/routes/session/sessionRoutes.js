const express = require('express');

// Policies
const { checkUserOrGuest } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const SessionController = require('../../controllers/session/SessionController');

// Routes for controllers
router.post('/create',[checkUserOrGuest], SessionController.createSession);
router.get('/getById', SessionController.getById);
// router.post('/logout', [checkUserOrGuest], UserAuthController.logout);

// Export routes
module.exports = router;
