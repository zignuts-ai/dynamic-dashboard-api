const { getJson } = require("serpapi");

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

/**
 * Fetch news using SerpAPI.
 * @param {Object} params - Query parameters for SerpAPI.
 * @param {string} params.search - Search term.
 * @param {string} params.lang - Language code (default: 'en').
 * @param {string} params.max - Maximum number of results (default: '10').
 * @param {string} params.country - Country code (optional).
 * @returns {Promise<Array>} - Array of news articles with metadata.
 */
async function getNews({
  search = "",
  lang = "en",
  max = "10",
  country = "",
  engine = "bing",
}) {
  try {
    let params = {
      q: search,

      tbm: "nws",
      max: 2,
      api_key: process.env.SERPE_API_SECRET_KEY,
    };

    if (engine) {
      params.engine = engine;
    } else {
      params.engine = "google";
    }
    console.log("params: ", params);
    let example;
    let data = await getJson(
      params,
      (json) =>
        json[params.engine == "google" ? "news_results" : "organic_results"]
    );
    console.log("data1111: ", data.organic_results);

    if (params.engine == "google") {
      example = data.news_results?.slice(
        0,
        Math.min(2, data.news_results?.length)
      );
    } else {
      example = data.organic_results?.slice(
        0,
        Math.min(2, data.organic_results?.length)
      );
    }

    console.log("example: ", example);

    let response = await fetchAndSaveArticles(example);
    console.log("response: ", response);
    return response;
  } catch (error) {
    console.error("Error fetching news:", error.message);
    throw error;
  }
}

/**
 * Fetch article content from a URL.
 * @param {string} url - The URL of the article.
 * @returns {Promise<{url: string, title: string, content: string}>} - Article data.
 */
async function fetchArticleContent(url) {
  console.log("url: ", url);
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const title = $("title").text() || "No Title Found";
    const paragraphs = $("p");
    const content = paragraphs
      .map((_, el) => $(el).text())
      .get()
      .join(" ");

    return { url, title, content };
  } catch (error) {
    console.error(`Error fetching article from ${url}:`, error.message);
    return {
      url,
      title: "Error fetching title",
      content: "Error fetching content",
    };
  }
}

/**
 * Fetch full articles for the news results.
 * @param {Array} articles - Array of articles with metadata from SerpAPI.
 */
async function fetchAndSaveArticles(articles) {
  console.log("articles: ", articles);
  const results = [];

  for (const article of articles) {
    console.log("article: ", article);
    const { link } = article;
    const data = await fetchArticleContent(link);
    console.log("dataaadfdfsd: ", data);

    results.push(data);
  }
  return results;
  console.log("results: ", results);
  const filePath = "./articles.json";
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2), "utf8");
  console.log(`Articles saved to ${filePath}`);
}

/**
 * Main function to fetch news and save full articles.
 */

module.exports = { getNews };
