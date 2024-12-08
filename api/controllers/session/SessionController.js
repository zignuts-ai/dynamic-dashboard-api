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
const { createMessage } = require("../../helpers/message/createMessage");
const { getNews } = require("../../helpers/news/getNewsHelper");
const { createSession } = require("../../helpers/session/createSession");
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
  createSession: async (req, res) => {
    console.log("createSession: ");
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
      console.log("summarizeNews: ", summarizeNews);

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
  getById: async (req, res) => {
    try {
      const { sessionId } = req.query;
      const query = `SELECT
    s.id AS "sessionId",
    s.name,
    s."userId",
    s.prompt,
    s.is_active,
    s.created_at,
    s.created_by,
    s.updated_at,
    s.updated_by,
    s.deleted_at,
    s.deleted_by,
    s.is_deleted,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'messageId', m.id,
                'message', m.message,
				'type', m.type,
				'role', m.role,
				'metadata', m.metadata,
                'created_at', m.created_at,
                'created_by', m.created_by
            )
        ) FILTER (WHERE m.id IS NOT NULL AND m.is_active = true ),
        '[]'::JSON
    ) AS messages
FROM
    public.sessions s
LEFT JOIN
    public.messages m
ON
    s.id = m."sessionId"
	WHERE s.id = '${sessionId}'
GROUP BY
    s.id;`;
      const session = await sequelize.query(query);
      // const session = await Session.findOne({ where: { id: sessionId } });
      if (!session?.[0]) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_STATUS_CODE.NOT_FOUND,
          message: req.__("Session.NotFound"), // Modify this message if needed
          data: "",
          error: "",
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__("Session.Found"), // Modify this message if needed
        data: session?.[0],
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
