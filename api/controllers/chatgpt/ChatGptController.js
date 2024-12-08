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
  newChat: async (req, res) => {
    try {
      const userId =  req.me.id;
      const { prompt, sessionId} = req.body;
   
      let validationObject = {
        prompt: VALIDATION_RULES.SESSION.PROMPT,
        sessionId: VALIDATION_RULES.SESSION.SESSIONID,
      };
      let validationData = {
        prompt, sessionId
      };

      let validation = new VALIDATOR(validationData, validationObject);

      if (validation.fails()) {
          //if any rule is violated
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: 'Validation error',
            data: '',
            error: validation.errors.all(),
          });
        }

        const keywords = await generateKeywords(prompt);
        console.log('keywords: ', keywords);
        console.log('keywords.title: ', keywords.title);
        if(!keywords.title){
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: 'Failed to generate keywords, please try again with proper prompt',
            data: '',
            error: '',
          });
        }
  
    // const id = UUID();
    // Create a new user in the database
    let newSession = await Session.create({
      id: sessionId,
      prompt: prompt,
      name: keywords.title,
      sessionId: sessionId,
      userId: userId,
      createdBy: sessionId,
      updatedBy: sessionId,
    });
        // Return success response with the user data and token
        return res.status(HTTP_STATUS_CODE.OK).json({
          status: HTTP_STATUS_CODE.OK,
          message: req.__('Session.Created'), // Modify this message if needed
          data: newSession,
          error: '',
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
