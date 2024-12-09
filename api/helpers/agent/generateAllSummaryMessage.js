const {
  CONTENT_TYPES,
  MESSAGE_ROLE_TYPES,
} = require("../../../config/constants");
const { imageGeneration } = require("../chatgpt/imageGeneration");
const { videoGeneration } = require("../chatgpt/videoGeneration");
const { createMessage } = require("../message/createMessage");

const generateAllSummaryMessage = async ({ postObj, keywords, news, userId, sessionId }) => {
  let message = [];
  if (postObj?.post_content) {
    const msg = await createMessage({
      type: CONTENT_TYPES.TEXT,
      role: MESSAGE_ROLE_TYPES.AI,
      message: postObj?.post_content,
      metadata: { ...keywords, userPrompt: postObj?.post_content },
      userId: userId,
      prompt: postObj?.post_content,
      news: news,
      sessionId: sessionId,
    });
    message.push(msg);
  }

  if (postObj?.image_prompt) {
    const generateImageUrl  = await imageGeneration({prompt: postObj?.image_prompt})
    const msg = await createMessage({
      type: CONTENT_TYPES.IMAGE,
      role: MESSAGE_ROLE_TYPES.AI,
      message: generateImageUrl,
      metadata: { ...keywords, userPrompt: postObj?.post_content },
      userId: userId,
      prompt: postObj?.post_content,
      news: news,
      sessionId: sessionId,
    });
    message.push(msg);
  }

  if (postObj?.video_prompt) {
    const generateVideo = await videoGeneration({prompt: postObj?.video_prompt})
    const msg = await createMessage({
      type: CONTENT_TYPES.VIDEO,
      role: MESSAGE_ROLE_TYPES.AI,
      message: generateVideo,
      metadata: { ...keywords, userPrompt: postObj?.video_prompt },
      userId: userId,
      prompt: postObj?.video_prompt,
      news: news,
      sessionId: sessionId,
    });
    message.push(msg);
  }

  if (postObj?.post_content) {
  }

  return message
};

module.exports = {
    generateAllSummaryMessage
}
