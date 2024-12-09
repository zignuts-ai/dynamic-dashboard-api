const {
  HTTP_STATUS_CODE,
  CONTENT_TYPES,
  VALIDATOR,
  UUID,
  MESSAGE_ROLE_TYPES,
  MODAL_TYPE,
} = require("../../../config/constants");
const { VALIDATION_RULES } = require("../../../config/validationRules");
const {
  articlesSummarizer,
} = require("../../helpers/chatgpt/articlesSummarizer");
// const { generateKeywords } = require('../../helpers/chatgpt/generateKeywords');
const { imageGeneration } = require("../../helpers/chatgpt/imageGeneration");
const { videoGeneration } = require("../../helpers/chatgpt/videoGeneration");
const { createMessage } = require("../../helpers/message/createMessage");
const { getNews } = require("../../helpers/news/getNewsHelper");
const { createSession } = require("../../helpers/session/createSession");
const { getByIdSession } = require("../../helpers/session/getByIdSession");
const { updateSession } = require("../../helpers/session/updateSession");
const { detectUserIntent } = require("../../helpers/agent/detectUserIntent");
const { generateKeywords } = require("../../helpers/agent/generateKeywords");
const { generatePost } = require("../../helpers/agent/generatePost");
const { Session, Message, sequelize } = require("../../models");
const {
  generateAllSummaryMessage,
} = require("../../helpers/agent/generateAllSummaryMessage");

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
      const { prompt, sessionId, platform, postType, tone } = req.body;

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
          search: keywords.source + platform + keywords.news,
          engine: keywords.searchEngine,
        });
      }
      await updateSession(sessionId, {
        news: newsData,
      });

      const summarizeNews = await articlesSummarizer({
        prompt,
        articles: newsData,
        tone: tone,
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

      if (postType === CONTENT_TYPES.TEXT) {
        const textMessage = await createMessage({
          type: CONTENT_TYPES.TEXT,
          role: MESSAGE_ROLE_TYPES.AI,
          message: summarizeNews.post_content,
          metadata: keywords,
          userId: userId,
          sessionId: sessionId,
          messageNews: newsData,
        });

        messages.push(textMessage);
      }

      if (postType === CONTENT_TYPES.IMAGE) {
        const generatedImageURl = await imageGeneration({
          prompt: summarizeNews.image_prompt,
        });
        const textMessage = await createMessage({
          type: CONTENT_TYPES.IMAGE,
          role: MESSAGE_ROLE_TYPES.AI,
          message: generatedImageURl,
          metadata: keywords,
          userId: userId,
          sessionId: sessionId,
          messageNews: newsData,
        });
        messages.push(textMessage);
      }
      if (postType === CONTENT_TYPES.VIDEO) {
        const generatedImageURl = await videoGeneration({
          prompt: summarizeNews.video_prompt,
        });

        const textMessage = await createMessage({
          type: CONTENT_TYPES.VIDEO,
          role: MESSAGE_ROLE_TYPES.AI,
          message: generatedImageURl,
          metadata: keywords,
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
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  /**
   * @name chat
   * @file ChatGptController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Chats with the user
   * @author Parth T. (Zignuts)
   */
  chat: async (req, res) => {
    try {
      // fetching the required fields from req
      const userId = req?.me?.id || null;
	  console.log('userId: ', userId);s
      const { prompt, sessionId } = req.body;

      // validating fields
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

      // getting the session details. If session does not exist, create a new one.
      let allPreviousMessage = [];
      let sendedMessage = [];

      let session = await getByIdSession(sessionId);
      let getLastUserMessage;
      if (!session) {
        session = await createSession({
          id: sessionId,
          prompt,
          userId: userId || null,
          createdBy: userId || null,
          updatedBy: userId || null,
        });
      } else {
        const lastMessage = await Message.findAll({
          where: {
            sessionId: sessionId,
            // role: MESSAGE_ROLE_TYPES.USER,
            type: CONTENT_TYPES.TEXT,
          },
          order: [["createdAt", "DESC"]],
        });
        // getLastUserMessage = lastMessage.message;
        sendedMessage = [...lastMessage];
        allPreviousMessage = lastMessage.map((f) => ({
          role: f.role,
          message: f.message,
          type: f.type,
          metadata: f?.metadata,
        }));
        // console.log('lastMessage: ', lastMessage.prompt);
      }

      let msg = await createMessage({
        type: null,
        message: prompt,
        metadata: null,
        userId: userId,
        sessionId: sessionId,
        role: MESSAGE_ROLE_TYPES.USER,
      });
      sendedMessage.push(msg);

      allPreviousMessage.push({
        role: msg.role,
        message: msg.message,
        type: msg.type,
        metadata: msg.metadata,
      });

      const newPrompt = JSON.stringify({
        allPreviousMessage,
        newPrompt: prompt,
      });

      // Get the user intent
      const intent = await detectUserIntent(newPrompt);
	  console.log('intent: ', intent);
      let allNews = [];

      // Generate the post
      switch (intent) {
        case "generate_post": {
          // Generate a new post
          // Step 1 - Analyse the keywords
          const keywords = await generateKeywords(prompt, MODAL_TYPE.GROQ);
         
          let post = null;
          try {
            const { postSummery, news } = await generatePost(keywords);
            post = postSummery;

            if (news.length) {
              await updateSession(sessionId, { news });
              allNews = news;
            }
          } catch (error) {
			

		  }

          if (!post?.post_content) {
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
              status: HTTP_STATUS_CODE.BAD_REQUEST,
              message: "Please say proper contexts",
              data: [],
              error: "",
            });
          }

          const allMessage = await generateAllSummaryMessage({
            postObj: post,
            keywords,
            news: allNews,
            userId,
            sessionId,
          });
          sendedMessage = [...sendedMessage, ...allMessage];

          break;
        }
        case "refine_post": {
          // Refine the post
          // Generate a new post
          // Step 1 - Analyse the keywords
          const keywords = await generateKeywords(newPrompt, MODAL_TYPE.GROQ);
         
          let post = null;
          try {
            const { postSummery, news } = await generatePost(keywords, allNews, true);
            post = postSummery;

            if (news.length) {
              await updateSession(sessionId, { news });
              allNews = news;
            }
          } catch (error) {}

          if (!post?.post_content) {
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
              status: HTTP_STATUS_CODE.BAD_REQUEST,
              message: "Please say proper contexts",
              data: [],
              error: "",
            });
          }

          const allMessage = await generateAllSummaryMessage({
            postObj: post,
            keywords,
            news: allNews,
            userId,
            sessionId,
          });
          sendedMessage = [...sendedMessage, ...allMessage];

          break;
        }
        case "generate_image": {
            // Generate image
            const imageUrl = await imageGeneration({prompt});
            let msg = await createMessage({
              type: CONTENT_TYPES.IMAGE,
              message: imageUrl,
              metadata: {
                userPrompt: prompt,
              },
              userId: userId,
              sessionId: sessionId,
              role: MESSAGE_ROLE_TYPES.AI,
            });
            sendedMessage.push(msg);
          
          break;
		}
        case "generate_video": {
          // Generate video
          const vedioUrl = await videoGeneration({prompt});
            let msg = await createMessage({
              type: CONTENT_TYPES.VIDEO,
              message: vedioUrl,
              metadata: {
                userPrompt: prompt,
              },
              userId: userId,
              sessionId: sessionId,
              role: MESSAGE_ROLE_TYPES.AI,
            });
            sendedMessage.push(msg);
          break;
        }
        case "generate_meme":
          // Generate Meme
          break;
        default:
          break;
      }

      // const keywords = await generateKeywords(newPromt);
      // if (!keywords.title) {
      // 	return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      // 		status: HTTP_STATUS_CODE.BAD_REQUEST,
      // 		message:
      // 			'Failed to generate keywords, please try again with proper prompt',
      // 		data: '',
      // 		error: '',
      // 	});
      // }

	  const allMessage = {
        ...(session?.dataValues ?? session ?? {}),
        messages: [...sendedMessage],
        news: [...(session?.news ?? []), ...allNews],
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
