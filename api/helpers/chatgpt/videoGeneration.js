const {
  replicate,
  BACK_END_BASE_URL,
  GENERATED_VIDEO_PATH,
} = require("../../../config/constants");
const { writeFile, mkdir } = require("node:fs/promises");
const { randomUUID } = require("crypto");
const path = require("path");
const { groqTextToText } = require("../model/groqTextToText");
const { chatgptTexttoText } = require("../model/chatgptTextToText");

async function videoGeneration({ prompt }) {
  try {

    const newPrompt = await improveVideoGenerationPrompt(prompt)
    const inputPrompt = {
      fps: 24,
      prompt: newPrompt,
      num_frames: 121,
      guidance_scale: 5.5,
      num_inference_steps: 30,
    };

    // Call the Replicate API
    const response = await replicate.run(
      "lucataco/mochi-1:1944af04d098ef69bed7f9d335d102e652203f268ec4aaa2d836f6217217e460",
      {
        input: inputPrompt,
      }
    );

    // Assuming the API returns a file buffer
    const fileBuffer = response; // Adjust if the actual data structure is different

    // Generate a unique file name using UUID
    const fileName = `${randomUUID()}.mp4`;
    const outputDir = path.join(__dirname, GENERATED_VIDEO_PATH);
    const outputPath = path.join(outputDir, fileName);

    // Ensure the directory exists
    await mkdir(outputDir, { recursive: true });

    // Write the buffer to the file
    await writeFile(outputPath, fileBuffer);

    // Construct the public URL
    const filePublicUrl = `${BACK_END_BASE_URL}/generatedVideo/${fileName}`;
    return filePublicUrl;
  } catch (error) {
    console.error(
      "Error generating video:",
      error.response?.data || error.message
    );
    throw error; // Re-throw the error for further handling
  }
}

const videoGenerateImprovePrompt = `Generate a humorous video meme prompt based on the following user description. Include:

Scene Description: Detailed setting, characters, and key moments.
Character Actions & Expressions: Exaggerated reactions or movements.
Dialogues/Subtitles: Funny lines or voiceovers.
Audio & Sound Effects: Background music and sound effects that enhance humor.
Contextual Elements: Additional humorous details (e.g., crowd reactions, props).
Keep it short, comedic, and playful in tone.`

async function improveVideoGenerationPrompt (prompt) {
  try {
    const messages = [
      {
        role: "system",
        content: videoGenerateImprovePrompt,
      },
      { role: "user", content: `${prompt}` },
    ];

    const response = await chatgptTexttoText(messages);

    return response;
  } catch (error) {}
}

module.exports = { videoGeneration };
