const express = require('express');

// Policies
// const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

//multer configuration
const upload = require('../../../config/multer');

// Controllers
const StorageController = require('../../controllers/example/StorageController');

// Routes for controllers
router.post('/upload', upload.array('file', 12), StorageController.upload);
router.post('/delete', StorageController.delete);
router.get('/download', StorageController.download);

// Export routes
module.exports = router;
