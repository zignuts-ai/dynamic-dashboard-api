const { openai } = require("../../../config/constants");

const systemPrompt = `You are a helpful assistant. Your job is to take user input and detect news keywords, tone and style, platform name and type of content to be generated and return a JSON object. The news keywords will be used for fetching relevant news articles and doing further research. If there are multiple news keywords, tone and style, platforms and type of contents, make them comma-separated. If user does not mention the tone, identify the tone based on the given input. If user does not mention name of the platform, keep it blank. Do not give any other details, just the required data as per the following structure. 
Example: 
User: Create a humorous post about AI replacing jobs for a Twitter audience
Output: 
{
"news": "ai-replacing-jobs",
"tone": "humorous",
"platform": "twitter",
"content_type": "text"
}
User: Create an informative post with image about india-australia cricket match for a LinkedIn audience
Output: 
{
"news": "india-australia-cricket-match",
"tone": "informative",
"platform": "linkedin",
"content_type": "text, image"
}`;

async function generateKeywords(query) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // You can also use 'gpt-4-turbo'
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: `${query}` },
      ],
    });

    // Extracting and returning keywords
    let keywords = response.choices[0].message.content.trim();
    try {
      keywords = JSON.parse(keywords);
    } catch (error) {
      keywords = keywords;
    }
    return keywords;
  } catch (error) {
    console.error("Error generating keywords:", error.message);
    return null;
  }
}

module.exports = { generateKeywords };
