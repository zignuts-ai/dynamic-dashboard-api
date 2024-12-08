const express = require('express');

// Policies
const { checkUserOrGuest, isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const SessionController = require('../../controllers/session/SessionController');
const { isGuestUser } = require('../../policies/isGuestUser');

// Routes for controllers
router.post('/create',[isGuestUser], SessionController.createSession);
router.get('/getById', SessionController.getById);
router.get('/list',[isUser], SessionController.getList);

// router.post('/logout', [checkUserOrGuest], UserAuthController.logout);

// Export routes
module.exports = router;
