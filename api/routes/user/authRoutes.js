const express = require('express');

// Policies
const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const UserAuthController = require('../../controllers/user/auth/AuthController');

// Routes for controllers
router.post('/login', UserAuthController.login);
router.post('/forgot/password', UserAuthController.forgotPassword);
router.post('/reset/password', UserAuthController.resetPassword);
router.post('/check/token', UserAuthController.checkToken);
router.post('/logout', [isUser], UserAuthController.logout);

// Export routes
module.exports = router;
