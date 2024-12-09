const { openai, MODAL_TYPE } = require("../../../config/constants");
const { chatgptTexttoText } = require("../model/chatgptTextToText");
const { groqTextToText } = require("../model/groqTextToText");
const { getNews } = require("../../helpers/news/getNewsHelper");
const { summarizeText } = require("./summarizeText");

async function generatePost(keywords, allNews = [], isRefine = false) {
  try {
    let response;
    if (typeof keywords === "string") {
      return null;
    }

    // crawl the web to get the relevant news
    searchQuery = keywords?.source
      ? `${keywords?.source}+${keywords?.news}`
      : keywords.news;
    // console.log(searchQuery);

    let newsData = [];

	if(isRefine) {
		newsData = allNews
	} else {
		if (keywords?.news) {
			newsData = await getNews({
			  search: searchQuery,
			  engine: keywords.searchEngine,
			});
		  }
	}
    

    // console.log('newsData: ', newsData);

    // console.log(newsData);
    // if (type == MODAL_TYPE.GROQ) {
    // 	response = await groqTextToText(messageData, true);
    // } else {
    // 	response = await chatgptTexttoText(messageData);
    // }
    // summarize the news
    let textSummary = await summarizeText(keywords, newsData);

    // const summarizeNews = await articlesSummarizer({
    // 	prompt,
    // 	// type: CONTENT_TYPES.TEXT,
    // 	articles: newsData,
    // 	tone: keywords.tone,
    // 	contentType: keywords.content_type,
    //   });
    // console.log(textSummary);

    // check if image generation is required

    // check if video generation is required

    // check if meme generation is required

    return { postSummery:  textSummary, news: newsData};
  } catch (error) {
    console.error("Error generating keywords:", error.message);
    return null;
  }
}

module.exports = { generatePost };
