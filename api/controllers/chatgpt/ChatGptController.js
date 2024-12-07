const { generateKeywords } = require("../../helpers/chatgpt/generateKeywords");
const {
  VALIDATOR,
  HTTP_STATUS_CODE,
  BCRYPT,
  TOKEN_EXPIRY,
  USER_ROLES,
  UUID,
  PAGE_NAMES,
  SQS_EVENTS,
  CONTENT_TYPES,
} = require("../../../config/constants");
const { getNews } = require("../../helpers/news/getNewsHelper");
const dummyArticles = [
  {
    id: 1,
    title: "The Rise of AI in Everyday Life",
    description:
      "How artificial intelligence is transforming daily routines and industries.",
    content:
      "Artificial intelligence (AI) is no longer just a concept of the future. From voice assistants like Alexa and Siri to smart recommendations on Netflix and Amazon, AI has permeated our lives in countless ways. This article explores its impact and what lies ahead for this groundbreaking technology.",
    tags: ["AI", "Technology", "Innovation"],
    author: "John Doe",
    date: "2024-12-07",
  },
  {
    id: 2,
    title: "Understanding Machine Learning Basics",
    description: "A beginner's guide to the fundamentals of machine learning.",
    content:
      "Machine learning (ML) is a subset of AI that allows systems to learn and adapt from data. Key concepts include supervised learning, unsupervised learning, and reinforcement learning. This article breaks down these ideas for newcomers to the field.",
    tags: ["Machine Learning", "AI", "Education"],
    author: "Jane Smith",
    date: "2024-11-30",
  },
  {
    id: 3,
    title: "Top 10 Applications of AI in 2024",
    description:
      "Exploring the most impactful uses of artificial intelligence this year.",
    content:
      "From healthcare to entertainment, AI applications continue to grow in scope and significance. This article highlights the top 10 ways AI is changing industries, including predictive analytics, autonomous vehicles, and AI-generated content.",
    tags: ["AI", "Applications", "Trends"],
    author: "Alice Johnson",
    date: "2024-12-01",
  },
  {
    id: 4,
    title: "Ethical Challenges in AI Development",
    description:
      "Examining the ethical dilemmas posed by artificial intelligence.",
    content:
      "As AI technologies advance, they bring with them a host of ethical challenges. This article discusses issues like bias in algorithms, data privacy, and the implications of autonomous decision-making.",
    tags: ["Ethics", "AI", "Society"],
    author: "Robert Brown",
    date: "2024-12-05",
  },
  {
    id: 5,
    title: "Creative Uses of AI: Art, Music, and Literature",
    description:
      "How AI is driving creativity in art, music, and storytelling.",
    content:
      "Artificial intelligence is pushing the boundaries of creativity, enabling the creation of stunning artworks, captivating music, and compelling narratives. Discover how tools like DALL·E, ChatGPT, and other AI platforms are revolutionizing creative fields.",
    tags: ["AI", "Creativity", "Art"],
    author: "Emily Davis",
    date: "2024-12-06",
  },
];
const {
  articlesSummarizer,
} = require("../../helpers/chatgpt/articlesSummarizer");
module.exports = {
  /**
   * @name generateKeywords
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Get keywords(User Panel)
   * @author Jainam Shah (Zignuts)
   */
  getKeywords: async (req, res) => {
    try {
      const prompt = req.query.prompt; // Get query from the URL (e.g., /generate-keywords?query=latest news)
      console.log("query: ", prompt);

      if (!prompt) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }

      const keywords = await generateKeywords(prompt);

      if (keywords) {
        return res.status(HTTP_STATUS_CODE.OK).json({ keywords });
      } else {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Failed to generate keywords",
          data: "",
          error: "",
        });
      }
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  getRecentNews: async (req, res) => {
    try {
      const prompt = req.query.prompt; // Get query from the URL (e.g., /generate-keywords?query=latest news)
      console.log("prompt: ", prompt);

      if (!prompt) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }

      const keywords = await generateKeywords(prompt);
      console.log('keywords: ', keywords);

      if (!keywords) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Failed to generate keywords",
          data: "",
          error: "",
        });
      }

      const news = await getNews({
        search: keywords,
      });
     
    
      console.log('news: ', news);
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: news,
        error: "",
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
  getArticlesSummery: async (req, res) => {
    try {
      const prompt = req.body.prompt;
      console.log("prompt: ", prompt);
      console.log("req.body: ", req.body);
      let articles = req.body.articles;
      console.log("articles: ", articles);

      if (!prompt || !articles) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: "Please provide a query parameter.",
          data: "",
          error: "",
        });
      }
      const summary = await articlesSummarizer({
        prompt,
        type: CONTENT_TYPES.TEXT,
        articles,
      });
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: summary,
        error: "",
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
};
