// gptHelper.js

const { openai, CONTENT_TYPES } = require("../../../config/constants");
const { constructChatGPTMessages } = require("../../utils/chatgpt/chatgpt");

async function articlesSummarizer({
  prompt,
  type = CONTENT_TYPES.TEXT,
  articles = [],
  ...rest
}) {
  try {
    let messages = [
      {
        role: "system",
        content: "You are a helpful assistant for generating keywords.",
      },
      { role: "user", content: `Generate relevant keywords for: "${prompt}"` },
    ];
    if (type === CONTENT_TYPES.TEXT) {
      messages = constructChatGPTMessages({
        userPrompt: prompt,
        articles: articles,
        ...rest,
      });
    }
    console.log("messages", messages);
    const response = await groqTextToText(messages);
    console.log("response: ", response);

    return response;
  } catch (error) {
    console.error("Error generating keywords:", error);
    return null;
  }
}

module.exports = { articlesSummarizer };
