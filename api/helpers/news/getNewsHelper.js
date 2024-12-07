/**
 * General-purpose query helper to execute any SQL query.
 * 
 * @returns {Promise<any>} - The results of the query.
 */
async function getNews({search = "", lang = "en", max = "10", country = ""}) {
    try {
      let params = {
        q: search,
        lang: lang,
        max: max
      };
  
      if (country) {
        params.country = country;
      }
  
      // Convert the params object to a query string
      const queryString = new URLSearchParams(params).toString();
  
      // Make the fetch request with the query string
      let results = await fetch(`https://gnews.io/api/v4/search?${queryString}`);
      
      // Parse the JSON response
      let data = await results.json();
      return data;
    } catch (error) {
      console.error("Database query error:", error.message);
      throw error; // Re-throw the error for higher-level error handling
    }
  }
  
  module.exports = { getNews };
  