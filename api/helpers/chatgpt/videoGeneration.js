// gptHelper.js

const {
  RUNWAY_API_URL,
  RUNWAY_API_KEY,
  axios,
} = require("../../../config/constants");

async function videoGeneration({ prompt }) {
  console.log("prompt: ", prompt);
  try {
    const response = await axios.post(
      RUNWAY_API_URL,
      {
        promptText: prompt, // The text prompt for video generation
        duration: 5, // Duration in seconds (if supported)
        resolution: "720p", // Desired resolution
      },
      {
        headers: {
          Authorization: `Bearer ${RUNWAY_API_KEY}`,
          "Content-Type": "application/json",
          "X-Runway-Version": "2024-11-06",
        },
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
