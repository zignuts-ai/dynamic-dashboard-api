// gptHelper.js

const { replicate } = require("../../../config/constants");

async function videoGeneration({ prompt }) {
  try {
    const inputPrompt = {
      fps: 24,
      prompt,
      num_frames: 121,
      guidance_scale: 5.5,
      num_inference_steps: 30,
    };
    const response = await replicate.run(
      "lucataco/mochi-1:1944af04d098ef69bed7f9d335d102e652203f268ec4aaa2d836f6217217e460",
      {
        input: inputPrompt,
      }
    );

    console.log("response: ", response);
    // Assuming the API returns a video URL or a base64 encoded video
    const videoUrl = response.data.video_url;
    return videoUrl;
  } catch (error) {
    console.error(
      "Error generating video:",
      error.response?.data || error.message
    );
  }
}

module.exports = { videoGeneration };
