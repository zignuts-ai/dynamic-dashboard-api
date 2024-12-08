// gptHelper.js

const { openai } = require("../../../config/constants");

async function imageGeneration({ prompt, size = "1024x1024" }) {
  try {

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1, // Number of images to generate
      size: size, // Image dimensions: 256x256, 512x512, 1024x1024
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

module.exports = { imageGeneration };
