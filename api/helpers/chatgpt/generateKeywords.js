// gptHelper.js
require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateKeywords(query) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // You can also use 'gpt-4-turbo'
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for generating keywords.",
        },
        { role: "user", content: `Generate relevant keywords for: "${query}"` },
      ],
    });
    const keywords = response.choices[0].message.content.trim();
    return keywords;
  } catch (error) {
    console.error("Error generating keywords:", error);
    return null;
  }
}

module.exports = { generateKeywords };
