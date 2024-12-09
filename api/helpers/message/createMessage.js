// Import the Message model and UUID generator
const Message = require('../../models/Message');
const { UUID } = require('../../../config/constants'); // Import UUID generator if needed

/**
 * Helper to create a new message
 * @param {Object} messageData - Data for the message
 * @param {string} messageData.name - Name of the message
 * @param {string} messageData.type - Type of the message (e.g., 'text', 'image', etc.)
 * @param {string} messageData.message - Message content
 * @param {Object} [messageData.metadata] - Additional metadata as JSON
 * @param {string} messageData.id - Associated session ID
 * @param {string} messageData.userId - Associated user ID
 * @returns {Object} - The created message object
 */
async function createMessage({  type, message, metadata = {}, id, userId , role,sessionId, messageNews = null }) {

  
  try {
    const newMessage = await Message.create({
      id: UUID(), // Generate a unique ID for the message
      type,
      message,
      metadata,
      id,
      userId,
      role,
      sessionId,
      messageNews
    });

   
    return newMessage;
  } catch (error) {
    console.error('Error creating message:', error.message);
    throw new Error('Unable to create message');
  }
}

module.exports = { createMessage };
