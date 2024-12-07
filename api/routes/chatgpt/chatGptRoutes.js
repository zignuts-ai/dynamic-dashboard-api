const express = require("express");

// Policies
// const { isUser } = require('../../policies/isUser');

// Routes
const router = express.Router();

// Controllers
const ChatGptController = require("../../controllers/chatgpt/ChatGptController");

// Routes for controllers
router.get("/getKeywords", ChatGptController.getKeywords);
router.get("/getRecentNews", ChatGptController.getRecentNews);
router.post("/getArticlesSummarizer", ChatGptController.getArticlesSummery);
router.post("/generateImage", ChatGptController.generateImage);
router.post("/generateVideo", ChatGptController.generateVideo);

// Export routes
module.exports = router;
