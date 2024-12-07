const { generateKeywords } = require("../../helpers/chatgpt/generateKeywords");
const {
  VALIDATOR,
  HTTP_STATUS_CODE,
  BCRYPT,
  TOKEN_EXPIRY,
  USER_ROLES,
  UUID,
  PAGE_NAMES,
  SQS_EVENTS,
} = require("../../../config/constants");
const { getNews } = require("../../helpers/news/getNewsHelper");
module.exports = {
  /**
   * @name generateKeywords
   * @file AuthController.js
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
      console.log('keywords: ', keywords);

      if (!keywords) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Failed to generate keywords",
          data: "",
          error: "",
        });
      }

      const news = await getNews({
        search: keywords,
      });
     
    
      console.log('news: ', news);
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
};
