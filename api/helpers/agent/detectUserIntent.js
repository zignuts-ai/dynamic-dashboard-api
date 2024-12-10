const { openai, MODAL_TYPE } = require('../../../config/constants');
const { chatgptTexttoText } = require('../model/chatgptTextToText');
const { groqTextToText } = require('../model/groqTextToText');
const systemPrompt = `You are a helpful assistant. You are coordinating a conversational session to help user generate a social media post. You are given a certain functions to choose depending on the user intent. Your job is to understand user's intern and suggest a suitable function. 
ONLY respond with a suitable function name, DO NOT return anything else. 

Available functions:
generate_post - It generates a new post for a new context. 
refine_post - It refines the existing post based as per user's preferences
generate_image - It generates a new image for the post
generate_video - It generates a new video for the post
generate_meme - It generates a meme for the post. Trigger only if the user mentions 'meme' in the input`;

/**
 *
 * @param {query} string - The user's query
 * @param {*} string - The type of model to be used - chatgpt | groq
 * @returns string - The response from the model that is the user's intent
 */
async function detectUserIntent(query, type = MODAL_TYPE.GROQ) {
	let messageData = [
		{
			role: 'system',
			content: systemPrompt,
		},
		{ role: 'user', content: `${query}` },
	];
	try {
		let response;
		if (type == MODAL_TYPE.GROQ) {
			response = await groqTextToText(messageData);
		} else {
			response = await groqTextToText(messageData);
		}

		return response;
	} catch (error) {
		console.error('Error detecting the intent:', error.message);
		return null;
	}
}

module.exports = { detectUserIntent };
