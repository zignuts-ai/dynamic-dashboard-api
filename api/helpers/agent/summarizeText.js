const { openai, CONTENT_TYPES } = require('../../../config/constants');
const { constructChatGPTMessages } = require('../../utils/chatgpt/chatgpt');
const { chatgptTexttoText } = require('../model/chatgptTextToText');
const { groqTextToText } = require('../model/groqTextToText');

const systemPrompt = `You are an expert social media marketer and creative content writer. I will give you news article content, targeted social media, content type, tone of the post and any other preferences. You need to write a social media post using the given information. 

If the content type includes image, you should write a suitable prompt for image generation using Dall-E. 
If the content type includes video,you should write a suitable prompt for video generation using Runway. 
If the content type includes meme, you should suggest a meme with a suitable caption. 
If any content type are NOT specified, keep them blank. 

Return the response in following JSON structure only.  
{
 "post_title": "...",
 "post_content": "...",
 "image_prompt": "...",
 "video_prompt": "...",
 "meme": "...",
 "meme_caption": "..."
}`;
async function summarizeText(prompt, newsData) {
	try {
		let userPrompt = `tone: ${prompt.tone}
    platform: ${prompt.platform || 'post'}
    content type: ${prompt.contentType || 'text'}
    content: ${newsData[0]?.content}
    `;
		let messages = [
			{
				role: 'system',
				content: systemPrompt,
			},
			{ role: 'user', content: `${userPrompt}` },
		];
		// if (type === CONTENT_TYPES.TEXT) {
		// 	messages = constructChatGPTMessages({
		// 		userPrompt: prompt,
		// 		articles: articles,
		// 		...rest,
		// 	});
		// }

		const response = await groqTextToText(messages);
		// console.log('response: grok ', response);

		return response;
	} catch (error) {
		console.error('Error generating keywords:', error);
		return null;
	}
}

module.exports = { summarizeText };
