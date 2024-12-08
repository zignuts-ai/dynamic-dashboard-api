const systemPrompt = `You are an expert social media marketer and creative content writer. I will give you news article content, targeted social media, content type, tone of the post and any other preferences. You need to write a social media post using the given information. 

If the content type includes image, write a suitable prompt for image generation using Dall-E. 
If the content type includes video, write a suitable prompt for video generation using Runway. 
If the content type includes meme, suggest a meme with a suitable caption. 
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
function constructChatGPTMessages({ userPrompt, articles, ...rest }) {
  // Validate inputs
  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Invalid userPrompt. It must be a non-empty string.");
  }
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error(
      "Invalid articles. It must be a non-empty array of articles."
    );
  }

  // System message to set context
  const systemMessage = {
    role: "system",
    content: systemPrompt,
  };

  // User message with context and articles
  // let userContent = `Summarize the following articles based on this user prompt:\n\n"${userPrompt}"\n\n`;
  // articles.forEach((article, index) => {
  //   userContent += `### Article ${index + 1}:\n`;
  //   userContent += `Title: ${article.title}\n`;
  //   userContent += `Content: ${article.content}\n\n`;
  // });
  // userContent += `### Instructions:\n- Provide a concise summary based on the user prompt.\n- Focus on key insights that match the user's needs.\n- Use a bullet-point format or a short paragraph as appropriate.\n`;

  let userContent = {
    prompt: userPrompt,
    articles: articles,
    ...rest,
  };
  const userMessage = {
    role: "user",
    content: JSON.stringify(userContent),
  };

  // Return the message array
  return [systemMessage, userMessage];
}

module.exports = { constructChatGPTMessages };
