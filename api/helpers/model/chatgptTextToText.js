const { openai, MODAL_TYPE } = require("../../../config/constants");

async function chatgptTexttoText(messageData){
    let response = await openai.chat.completions.create({
        model: "gpt-4", // You can also use 'gpt-4-turbo'
        messages: messageData,
        
      });
        // Extracting and returning keywords
    let keywords = response.choices[0].message.content.trim();
    try {
      keywords = JSON.parse(keywords);
    } catch (error) {
      keywords = keywords;
    }
    return keywords
}
module.exports = {chatgptTexttoText}