const {
  HTTP_STATUS_CODE,
  CONTENT_TYPES,
  VALIDATOR,
  UUID,
  MESSAGE_ROLE_TYPES,
} = require("../../../config/constants");
const { VALIDATION_RULES } = require("../../../config/validationRules");
const {
  articlesSummarizer,
} = require("../../helpers/chatgpt/articlesSummarizer");
const { generateKeywords } = require("../../helpers/chatgpt/generateKeywords");
const { imageGeneration } = require("../../helpers/chatgpt/imageGeneration");
const { videoGeneration } = require("../../helpers/chatgpt/videoGeneration");
const { createMessage } = require("../../helpers/message/createMessage");
const { getNews } = require("../../helpers/news/getNewsHelper");
const { createSession } = require("../../helpers/session/createSession");
const { getByIdSession } = require("../../helpers/session/getByIdSession");
const { updateSession } = require("../../helpers/session/updateSession");
const { Session, Message, sequelize } = require("../../models");

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
      const userId = req?.me?.id || null;
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
      let newSession = await getByIdSession(sessionId);

      let getLastUserMessage = "";
      if (newSession) {
        newSession.id = sessionId;
        const lastMessage = await Message.findOne({
          where: {
            sessionId: sessionId,
            role: MESSAGE_ROLE_TYPES.USER,
          },
          order: [["createdAt", "DESC"]],
        });
        getLastUserMessage = lastMessage.message;
      }

      const newPromt = `user prompt: ${prompt}
      previousPrompt: ${getLastUserMessage}
      `;

      const keywords = await generateKeywords(newPromt);
      if (!keywords.title) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message:
            "Failed to generate keywords, please try again with proper prompt",
          data: "",
          error: "",
        });
      }

      if (!newSession) {
        newSession = await createSession({
          id: sessionId,
          prompt,
          userId: userId || null,
          createdBy: userId,
          updatedBy: userId,
          name: keywords.title,
        });
      }

      // id, prompt, userId, createdBy, updatedBy

      // name, type, message, metadata = {}, id, userId

      let messages = [];
      let msg = await createMessage({
        type: null,
        message: prompt,
        metadata: null,
        userId: userId,
        sessionId: sessionId,
        role: MESSAGE_ROLE_TYPES.USER,
      });
      messages.push(msg);

      let newsData = newSession?.news ?? [];
      if (!newsData || newsData.length == 0 || keywords.context_change) {
        newsData = await getNews({
          search: keywords.source + keywords.platform + keywords.news,
          engine: keywords.searchEngine,
        });
      }
      await updateSession(sessionId, {
        news: newsData,
      });

      const summarizeNews = await articlesSummarizer({
        prompt,
        articles: newsData,
        tone: keywords.tone,
        contentType: keywords.content_type,
      });

      if (!summarizeNews) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message:
            "Failed to generate content, please try again with proper prompt",
          data: "",
          error: "",
        });
      }


      if (summarizeNews.post_content) {
        const textMessage = await createMessage({
          type: CONTENT_TYPES.TEXT,
          role: MESSAGE_ROLE_TYPES.AI,
          message: summarizeNews.post_content,
          metadata: null,
          userId: userId,
          sessionId: sessionId,
          messageNews: newsData,
        });

        messages.push(textMessage);
      }

      if (summarizeNews.image_prompt) {
        const generatedImageURl = await imageGeneration({
          prompt: summarizeNews.image_prompt,
        });
        const textMessage = await createMessage({
          type: CONTENT_TYPES.IMAGE,
          role: MESSAGE_ROLE_TYPES.AI,
          message: generatedImageURl,
          metadata: null,
          userId: userId,
          sessionId: sessionId,
          messageNews: newsData,
        });
        messages.push(textMessage);
      }
      if (summarizeNews.video_prompt) {
        const generatedImageURl = await videoGeneration({
          prompt: summarizeNews.video_prompt,
        });

        const textMessage = await createMessage({
          type: CONTENT_TYPES.TEXT,
          role: MESSAGE_ROLE_TYPES.AI,
          message: generatedImageURl,
          metadata: null,
          userId: userId,
          sessionId: sessionId,
          messageNews: newsData,
        });
        messages.push(textMessage);
      }

      const allMessage = {
        ...(newSession?.dataValues ?? newSession ?? {}),
        messages: [...(newSession?.messages ?? []), ...messages],
        news: [...(newSession?.news ?? []), ...newsData],
      };

      // Return success response with the user data and token
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__("Session.Created"), // Modify this message if needed
        data: allMessage,
        error: "",
      });
    } catch (error) {
      console.log("error: ", error);
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
