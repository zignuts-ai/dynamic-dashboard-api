const { openai, MODAL_TYPE } = require("../../../config/constants");
const { chatgptTexttoText } = require("../model/chatgptTextToText");
const { groqTextToText } = require("../model/groqTextToText");
const systemPrompt = `You are a helpful assistant. Your job is to take user input and detect news keywords, tone, platform name, content type, search engine (if mentioned), news source (if mentioned), other user preferences (if mentioned) of the content to be generated and return a JSON object. The news keywords will be used for fetching relevant news articles and doing further research. If there are multiple news keywords, tone, platforms, content types or other preferences, make them comma-separated. If user does not mention the tone, identify the tone based on the given input. If user does not mention name of the platform, keep it blank. Only choose from the below constraints for tone, platforms and format.
Title: Generate a short title based on user prompt.
Tone: [Informative, Educative, Humorous, Funny, Meme, Serious, Professional, Concerning, Exciting]
Platform: [LinkedIn, Instagram, X, Facebook, Reddit]
Format: [Text, Image, Video, Meme]

Do not give any other details, just the required data as per the following structure. 

Example: 
User: Create a humorous post about AI replacing jobs for a Twitter audience
Output: 
{
"news": "ai-replacing-jobs",
"tone": "humorous",
"platform": "twitter",
"content_type": "text",
"preferences": "",
"search_engine": "",
"source": ""
}
User: Create an informative post not exceeding 160 characters with image about india-australia cricket match for a LinkedIn audience
Output: 
{
"news": "india-australia-cricket-match",
"title": "india-australia cricket match"
"tone": "informative",
"platform": "linkedin",
"content_type": "text, image",
"preferences": "not exceeding 160 characters",
"search_engine": "",
"source": ""
}
User: Crawl using google to create a post about recent football match of real madrid for a LinkedIn audience referring to news from BBC.
Output: 
{
"news": "india-australia-cricket-match",
"title": "Recent football match of real Madrid"
"tone": "informative",
"platform": "linkedin",
"content_type": "text, image",
"preferences": "not exceeding 160 characters",
"search_engine": "google",
"source": "bbc"
}
`;

async function generateKeywords(query, type = MODAL_TYPE.CHATGPT) {
  let messageData = [
    {
      role: "system",
      content: systemPrompt,
    },
    { role: "user", content: `${query}` },
  ];
  try {
    let response;
    if (type == MODAL_TYPE.GROQ) {
      response = groqTextToText(messageData);
    } else {
      response = chatgptTexttoText(messageData);
    }

    return response;
  } catch (error) {
    console.error("Error generating keywords:", error.message);
    return null;
  }
}

module.exports = { generateKeywords };
