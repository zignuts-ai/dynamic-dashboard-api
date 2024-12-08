// gptHelper.js

const { openai, CONTENT_TYPES } = require("../../../config/constants");
const { constructChatGPTMessages } = require("../../utils/chatgpt/chatgpt");
const { groqTextToText } = require("../model/groqTextToText");

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
    const response = await groqTextToText(messages);

    return response;
  } catch (error) {
    console.error("Error generating keywords:", error);
    return null;
  }
}

module.exports = { articlesSummarizer };
