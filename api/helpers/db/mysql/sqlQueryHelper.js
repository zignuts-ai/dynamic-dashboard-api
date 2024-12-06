const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
require("dotenv").config();

// Initialize OpenAI API with your OpenAI API key from .env
const llm = new OpenAI({
  openAIApiKey: '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', // Make sure to add OPENAI_API_KEY to your .env file
  temperature: 0.2, // Low temperature for deterministic results
});

/**
 * Converts a natural language question into an SQL query using the OpenAI model.
 * @param {object} schema - The database schema, structured as a JSON object.
 * @param {string} question - The natural language question to convert to SQL.
 * @returns {Promise<string>} - The generated SQL query.
 */
async function convertToSQL(schema, question) {
  const sqlPromptTemplate = `
    You are an expert at converting natural language questions into SQL queries.
    The user will ask a question about the database, and your job is to write the SQL query.
    The database schema is as follows:
    {schema}

    Question: {question}

    SQL Query:
  `;

  // Create a prompt template with the schema and question placeholders
  const prompt = new PromptTemplate({
    template: sqlPromptTemplate,
    inputVariables: ["schema", "question"],
  });

  // Format the prompt with the actual values of schema and question
  const queryPrompt = await prompt.format({ schema: JSON.stringify(schema), question });

  // Call the OpenAI API to generate the SQL query
  const sqlQuery = await llm.call(queryPrompt);

  // Return the generated SQL query (trimmed of extra whitespace)
  return sqlQuery.trim();
}

module.exports = { convertToSQL };
