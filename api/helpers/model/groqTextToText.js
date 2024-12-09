const { groq } = require("../../../config/constants");

async function groqTextToText(messageData) {
  try {
    // Format messageData as required by GROQ
    const payload = {
      messages: messageData,
      model: "llama-3.3-70b-versatile",
      temperature: 0.8
    };

    // Send request to GROQ API
    const response = await groq.chat.completions.create(payload);

    let keyword = response.choices[0].message.content;
    try {
      keyword = JSON.parse(keyword);
    } catch (e) {
      keyword = response.choices[0].message.content;
    }
    // Return the response
    console.log('keyword: grok ', keyword);

    return keyword;
  } catch (error) {
    throw error;
  }
}

module.exports = { groqTextToText };
