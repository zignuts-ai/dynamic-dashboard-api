const { getJson } = require('serpapi');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

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
	search = '',
	lang = 'en',
	max = '10',
	country = '',
	engine = '',
}) {
	try {
		let params = {
			q: search,
			tbm: 'nws',
			max: 2,
			api_key: process.env.SERPE_API_SECRET_KEY,
		};

		if (engine) {
			params.engine = engine;
		} else {
			params.engine = 'google';
		}

		let data = await getJson(
			params,
			(json) =>
				json[params.engine == 'google' ? 'news_results' : 'organic_results']
		);

		let searchResults;
		if (params.engine == 'google') {
			searchResults = data.news_results;
		} else {
			searchResults = data.organic_results;
		}
		// Fetch and save articles using Promise.allSettled for parallel processing
		let response = await fetchAndSaveArticles(searchResults);

		return response;
	} catch (error) {
		console.error('Error fetching news:', error.message);
		throw error;
	}
}

/**
 * Fetch article content from a URL.
 * @param {string} url - The URL of the article.
 * @returns {Promise<{url: string, title: string, content: string}>} - Article data.
 */
async function fetchArticleContent(url) {
	try {
		const response = await axios.get(url);
		const html = response.data;
		// console.log(html);
		const $ = cheerio.load(html);
		const title = $('h1').text() || $('title').text() || 'No Title Found';
		const paragraphs = $('p');
		const scripts = $('script');
		let content = paragraphs
			.map((_, el) => $(el).text())
			.get()
			.join(' ');

		// content =
		// 	content +
		// 	scripts
		// 		.map((_, el) => $(el).text())
		// 		.get()
		// 		.join(' ');
		// console.log(content);

		return { url, title, content };
	} catch (error) {
		console.error(`Error fetching article from ${url}:`, error.message);
		return {
			url,
			title: 'Error fetching title',
			content: 'Error fetching content',
		};
	}
}

/**
 * Fetch full articles for the news results.
 * @param {Array} articles - Array of articles with metadata from SerpAPI.
 */
async function fetchAndSaveArticles(articles) {
	// Use Promise.allSettled for parallel processing of articles
	const fetchPromises = articles
		.filter((_, i) => i < 1)
		.map((article) => {
			const { link } = article;
			return fetchArticleContent(link)
				.then((data) => data)
				.catch((error) => ({
					status: 'rejected',
					reason: error.message,
				}));
		});

	// Wait for all fetch operations to settle (both fulfilled and rejected)
	let results = await Promise.allSettled(fetchPromises);

	// Handle the settled results
	const successfulResults = results
		.filter((result) => result.status === 'fulfilled')
		.map((result) => result.value);
	const failedResults = results
		.filter((result) => result.status === 'rejected')
		.map((result) => result.reason);

	// Optionally, save the successful results to a file

	return successfulResults;
}

/**
 * Main function to fetch news and save full articles.
 */

module.exports = { getNews };
