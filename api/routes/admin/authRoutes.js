const express = require('express');

// Policies
const { isAdmin } = require('../../policies/isAdmin');

// Routes
const router = express.Router();

// Controllers
const AdminAuthController = require('../../controllers/admin/auth/AuthController');

// Routes for controllers
router.post('/login', AdminAuthController.login);
router.post('/forgot/password', AdminAuthController.forgotPassword);
router.post('/reset/password', AdminAuthController.resetPassword);
router.post('/check/token', AdminAuthController.checkToken);
router.post('/logout', [isAdmin], AdminAuthController.logout);

// Export routes
module.exports = router;
