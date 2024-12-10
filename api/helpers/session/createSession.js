// Import the Session model
const {UUID }  = require("../../../config/constants");// Import UUID generator
const { Session } = require("../../models");
/**
 * Helper function to create a new session
 * @param {Object} sessionData - Data for creating the session
 * @param {string} sessionData.id - Unique session ID
 * @param {string} sessionData.prompt - Session prompt
 * @param {string} sessionData.userId - User ID associated with the session
 * @param {string} sessionData.createdBy - ID of the creator
 * @param {string} sessionData.updatedBy - ID of the updater
 * @returns {Object} - The created session object
 */
async function createSession({ id, prompt, userId, createdBy, updatedBy, name, ...rest }) {

  const first200Chars = name.substring(0, 200);
  try {
    const newSession = await Session.create({
      id: id ? id : UUID(), // Ensure the ID matches your schema
      sessionId: id ? id : UUID(),
      prompt,
      userId,
      createdBy,
      updatedBy,
      updatedAt: Math.floor(Date.now() / 1000),
      first200Chars,
      ...rest
    });

    return newSession;
  } catch (error) {
    console.error('Error creating session:', error);
    return ;
  }
}

module.exports = { createSession };
