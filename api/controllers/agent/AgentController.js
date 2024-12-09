const {
	HTTP_STATUS_CODE,
	CONTENT_TYPES,
	VALIDATOR,
	UUID,
	MESSAGE_ROLE_TYPES,
} = require('../../../config/constants');
const { VALIDATION_RULES } = require('../../../config/validationRules');
const {
	articlesSummarizer,
} = require('../../helpers/chatgpt/articlesSummarizer');
// const { generateKeywords } = require('../../helpers/chatgpt/generateKeywords');
const { imageGeneration } = require('../../helpers/chatgpt/imageGeneration');
const { videoGeneration } = require('../../helpers/chatgpt/videoGeneration');
const { createMessage } = require('../../helpers/message/createMessage');
const { getNews } = require('../../helpers/news/getNewsHelper');
const { createSession } = require('../../helpers/session/createSession');
const { getByIdSession } = require('../../helpers/session/getByIdSession');
const { updateSession } = require('../../helpers/session/updateSession');
const { detectUserIntent } = require('../../helpers/agent/detectUserIntent');
const { generateKeywords } = require('../../helpers/agent/generateKeywords');
const { Session, Message, sequelize } = require('../../models');

module.exports = {
	/**
	 * @name testIntent
	 * @file AgentController.js
	 * @param {Request} req
	 * @param {Response} res
	 * @throwsF
	 * @description Test controller to test the intent detection
	 * @author Parth Trivedi (Zignuts)
	 */
	testIntent: async (req, res) => {
		try {
			const userId = req?.me?.id || null;
			const { prompt, sessionId } = req.body;

			// validating inputs
			let validationObject = {
				prompt: VALIDATION_RULES.SESSION.PROMPT,
				// sessionId: VALIDATION_RULES.SESSION.SESSIONID,
			};
			let validationData = {
				prompt,
				// sessionId,
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

			// Detecting the intent
			let intent = await detectUserIntent(prompt);

			// Return success response with the user data and token
			return res.status(HTTP_STATUS_CODE.OK).json({
				status: HTTP_STATUS_CODE.OK,
				message: req.__('Session.Created'), // Modify this message if needed
				data: intent,
				error: '',
			});
		} catch (error) {
			console.log('error: ', error);
			//return error response
			return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
				status: HTTP_STATUS_CODE.SERVER_ERROR,
				message: '',
				data: '',
				error: error.message,
			});
		}
	},
	/**
	 * @name analysePrompt
	 * @file AgentController.js
	 * @param {Request} req
	 * @param {Response} res
	 * @throwsF
	 * @description Test controller to test the intent detection
	 * @author Parth Trivedi (Zignuts)
	 */
	generateKeywords: async (req, res) => {
		try {
			const userId = req?.me?.id || null;
			const { prompt } = req.body;

			// validating inputs
			let validationObject = {
				prompt: VALIDATION_RULES.SESSION.PROMPT,
			};
			let validationData = {
				prompt,
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

			// Detecting the intent
			let keywords = await generateKeywords(prompt);

			// Return success response with the user data and token
			return res.status(HTTP_STATUS_CODE.OK).json({
				status: HTTP_STATUS_CODE.OK,
				message: req.__('Session.Created'), // Modify this message if needed
				data: keywords,
				error: '',
			});
		} catch (error) {
			console.log('error: ', error);
			//return error response
			return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
				status: HTTP_STATUS_CODE.SERVER_ERROR,
				message: '',
				data: '',
				error: error.message,
			});
		}
	},
};
