function constructChatGPTMessages({ userPrompt, articles }) {
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
    content:
      "You are a helpful assistant for summarizing articles based on user prompts.",
  };

  // User message with context and articles
  let userContent = `Summarize the following articles based on this user prompt:\n\n"${userPrompt}"\n\n`;
  articles.forEach((article, index) => {
    userContent += `### Article ${index + 1}:\n`;
    userContent += `Title: ${article.title}\n`;
    userContent += `Content: ${article.content}\n\n`;
  });
  userContent += `### Instructions:\n- Provide a concise summary based on the user prompt.\n- Focus on key insights that match the user's needs.\n- Use a bullet-point format or a short paragraph as appropriate.\n`;

  const userMessage = {
    role: "user",
    content: userContent,
  };

  // Return the message array
  return [systemMessage, userMessage];
}

module.exports = { constructChatGPTMessages };
