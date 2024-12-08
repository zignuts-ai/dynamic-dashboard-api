const { UUID, HTTP_STATUS_CODE } = require("../../../config/constants");
const { Message } = require("../../models");

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
  create: async (req, res) => {
    try {
      const userId = req.me.id || null;
      const { prompt, sessionId } = req.body;

      let validationObject = {
        prompt: VALIDATION_RULES.SESSION.PROMPT,
        sessionId: VALIDATION_RULES.SESSION.SESSIONID,
      };
      let validationData = {
        prompt,
        sessionId,
      };

      let validation = new VALIDATOR(validationData, validationObject);

      if (validation.fails()) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Validation error",
          data: "",
          error: validation.errors.all(),
        });
      }

      const keywords = await generateKeywords(prompt);
      if (!keywords.title) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message:
            "Failed to generate keywords, please try again with proper prompt",
          data: "",
          error: "",
        });
      }

      const findSession = await Session.findOne({
        where: {
          id: sessionId,
        },
      });
      if (findSession) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Session already exists",
          data: "",
          error: "",
        });
      }

      let newSession = await createSession({
        id: sessionId,
        prompt,
        userId: userId || null,
        createdBy: userId,
        updatedBy: userId,
        name: keywords.title,
      });
      // id, prompt, userId, createdBy, updatedBy

      // name, type, message, metadata = {}, id, userId
      let msg = await createMessage({
        type: null,
        message: prompt,
        metadata: null,
        userId: userId,
        sessionId: newSession.id,
        role: MESSAGE_ROLE_TYPES.USER,
      });

      const newsData = await getNews({
        search: keywords.source + keywords.platform + keywords.news,
        engine: keywords.searchEngine,
      });

      const summarizeNews = await articlesSummarizer({
        prompt,
        // type: CONTENT_TYPES.TEXT,
        articles: newsData,
        tone: keywords.tone,
        contentType: keywords.content_type,
      });

      const aiResponse = await createMessage({
        type: CONTENT_TYPES.TEXT,
        role: MESSAGE_ROLE_TYPES.AI,
        message: summarizeNews.post_content,
        metadata: null,
        userId: userId,
        sessionId: newSession.id,
      });

      // Return success response with the user data and token
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__("Session.Created"), // Modify this message if needed
        data: aiResponse,
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
