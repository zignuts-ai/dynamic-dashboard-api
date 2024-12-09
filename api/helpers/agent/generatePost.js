const { openai, MODAL_TYPE } = require('../../../config/constants');
const { chatgptTexttoText } = require('../model/chatgptTextToText');
const { groqTextToText } = require('../model/groqTextToText');
const { getNews } = require('../../helpers/news/getNewsHelper');
const { summarizeText } = require('./summarizeText');

async function generatePost(keywords, type = MODAL_TYPE.GROQ) {
	try {
		let response;
		// crawl the web to get the relevant news
		searchQuery = keywords.source
			? `${keywords.source}+${keywords.news}`
			: keywords.news;
		// console.log(searchQuery);
		let newsData = await getNews({
			search: searchQuery,
			engine: keywords.searchEngine,
		});
		// console.log(newsData);
		// summarize the news
		let textSummary = await summarizeText(keywords, newsData);
		console.log(textSummary);

		// check if image generation is required

		// check if video generation is required

		// check if meme generation is required

		if (type == MODAL_TYPE.GROQ) {
			response = await groqTextToText(messageData, true);
		} else {
			response = await chatgptTexttoText(messageData);
		}

		return response;
	} catch (error) {
		console.error('Error generating keywords:', error.message);
		return null;
	}
}

module.exports = { generatePost };
