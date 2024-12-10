// gptHelper.js

const { openai } = require("../../../config/constants");
const { chatgptTexttoText } = require("../model/chatgptTextToText");
const { groqTextToText } = require("../model/groqTextToText");

const IMAGE_GENERATION_TYPE = {
  MEME: "MEME",
};

async function imageGeneration({ prompt, size = "1024x1024", type = "" }) {
  try {
    let newPrompt = prompt;
    if (type === IMAGE_GENERATION_TYPE.MEME) {
      newPrompt = await improveMemeImagePrompt(prompt);
    } else {
      newPrompt = await improveImagePrompt(prompt);
    }


    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: newPrompt,
      n: 1, // Number of images to generate
      size: size, // Image dimensions: 256x256, 512x512, 1024x1024
      quality: "hd"
    });

    const imageUrl = response.data[0].url;

    return imageUrl;
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response?.data || error.message
    );
  }
}

const imageGenerateImprovePrompt = `Enhance image prompts for DALL-E 3 by making them clear, specific, and detailed. Include precise colors, textures, lighting, setting, and artistic style. Describe the scene’s composition, mood, and perspective while avoiding vague or copyrighted terms. Keep prompts concise but rich in actionable details, ideally 75–100 words.`;

async function improveImagePrompt(prompt) {
  try {
    const messages = [
      {
        role: "system",
        content: imageGenerateImprovePrompt,
      },
      { role: "user", content: `${prompt}` },
    ];

    const response = await groqTextToText(messages);

    return response;
  } catch (error) {
    console.log('error: ', error);

  }
}

const imageMemeGenerateImprove = `Create a detailed DALL-E image prompt for a meme based on the following idea. Include a vivid description of the scene, characters, expressions, and relevant objects. Specify the artistic style (e.g., cartoonish, photorealistic). Add a fitting caption to the image that conveys humor or sarcasm, and mention its placement (e.g., top, bottom, or integrated into the scene). Ensure the prompt is concise yet descriptive enough for generating a high-quality meme image.ideally 75–100 words."`;

async function improveMemeImagePrompt(prompt) {
  try {
    const messages = [
      {
        role: "system",
        content: imageMemeGenerateImprove,
      },
      { role: "user", content: `${prompt}` },
    ];

    const response = await groqTextToText(messages);

    return response;
  } catch (error) {
    console.log('error: ', error);

  }
}

module.exports = {
  imageGeneration,
  improveImagePrompt,
  improveMemeImagePrompt,
  IMAGE_GENERATION_TYPE
};
