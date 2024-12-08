// Import the Session model
const { Session } = require('../../models/Session'); // Adjust the path as needed

/**
 * Helper function to update an existing session
 * @param {string} id - Unique session ID to identify the session
 * @param {Object} updateData - Data to update the session
 * @param {string} [updateData.prompt] - Updated session prompt (optional)
 * @param {string} [updateData.userId] - Updated user ID associated with the session (optional)
 * @param {string} [updateData.updatedBy] - ID of the updater (required)
 * @returns {Object} - The updated session object
 */
async function updateSession(id, updateData) {
  try {
    // Check if the session exists
    const session = await Session.findOne({ where: { id: id } });
    if (!session) {
      throw new Error(`Session with ID ${id} not found.`);
    }

    // Update the session fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        session[key] = updateData[key];
      }
    });


    // Save the updated session
    await session.save();

    console.log('Session updated successfully:', session);
    return session;
  } catch (error) {
    console.error('Error updating session:', error.message);
    throw new Error('Unable to update session');
  }
}

module.exports = { updateSession };
