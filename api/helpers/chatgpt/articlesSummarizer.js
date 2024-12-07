// gptHelper.js

const { openai, CONTENT_TYPES } = require("../../../config/constants");
const { constructChatGPTMessages } = require("../../utils/chatgpt/chatgpt");

async function articlesSummarizer({
  prompt,
  type = CONTENT_TYPES.TEXT,
  articles = [],
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
      });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4", // You can also use 'gpt-4-turbo'
      messages,
    });
    const summary = response.choices[0].message.content.trim();
    return summary;
  } catch (error) {
    console.error("Error generating keywords:", error);
    return null;
  }
}

module.exports = { articlesSummarizer };
