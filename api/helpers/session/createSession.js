// Import the Session model
const { Session } = require('../../models/Session'); // Adjust the path as needed
const {UUID }  = require("../../../config/constants")// Import UUID generator
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
async function createSession({ id, prompt, userId, createdBy, updatedBy }) {
  try {
    const newSession = await Session.create({
      id: id ? id : UUID, // Ensure the ID matches your schema
      prompt,

      userId,
      createdBy,
      updatedBy,
    });

    console.log('Session created successfully:', newSession);
    return newSession;
  } catch (error) {
    console.error('Error creating session:', error.message);
    throw new Error('Unable to create session');
  }
}

module.exports = { createSession };
