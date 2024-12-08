const { generateKeywords } = require("../../helpers/chatgpt/generateKeywords");
const {
  HTTP_STATUS_CODE,
  CONTENT_TYPES,
} = require("../../../config/constants");
const { getNews } = require("../../helpers/news/getNewsHelper");

const {
  articlesSummarizer,
} = require("../../helpers/chatgpt/articlesSummarizer");
const { videoGeneration } = require("../../helpers/chatgpt/videoGeneration");
const { imageGeneration } = require("../../helpers/chatgpt/imageGeneration");
module.exports = {
  /**
   * @name generateKeywords
   * @file ChatGptController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Get keywords(User Panel)
   * @author Jainam Shah (Zignuts)
   */
  getKeywords: async (req, res) => {
    try {
      const prompt = req.query.prompt; // Get query from the URL (e.g., /generate-keywords?query=latest news)
      console.log("query: ", prompt);

      if (!prompt) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }

      const keywords = await generateKeywords(prompt);

      if (keywords) {
        return res.status(HTTP_STATUS_CODE.OK).json({ keywords });
      } else {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Failed to generate keywords",
          data: "",
          error: "",
        });
      }
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  getRecentNews: async (req, res) => {
    try {
      const prompt = req.query.prompt; // Get query from the URL (e.g., /generate-keywords?query=latest news)
      console.log("prompt: ", prompt);

      if (!prompt) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }

      const keywords = await generateKeywords(prompt);
      console.log("keywords: ", keywords);

      if (!keywords) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Failed to generate keywords",
          data: "",
          error: "",
        });
      }


      const news = await getNews({
        search: keywords.platform +keywords.platform+  keywords.news,
      });

      console.log("news: ", news);
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: news,
        error: "",
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  getArticlesSummery: async (req, res) => {
    try {
      const { prompt, articles } = req.body;

      if (!prompt || !articles) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }
      const summary = await articlesSummarizer({
        prompt,
        type: CONTENT_TYPES.TEXT,
        articles,
      });
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: summary,
        error: "",
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  generateImage: async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log("prompt: ", prompt);

      if (!prompt) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }
      const imageUrl = await imageGeneration({ prompt });
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: imageUrl,
        error: "",
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  generateVideo: async (req, res) => {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }
      const videoUrl = await videoGeneration({ prompt });
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: videoUrl,
        error: "",
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
};
