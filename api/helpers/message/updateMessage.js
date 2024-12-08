// Import the Message model
const Message = require('../../models/Message');

/**
 * Helper to update an existing message
 * @param {string} id - ID of the message to update
 * @param {Object} updateData - Fields to update in the message
 * @param {string} [updateData.name] - Updated name of the message
 * @param {string} [updateData.type] - Updated type of the message
 * @param {string} [updateData.message] - Updated content of the message
 * @param {Object} [updateData.metadata] - Updated metadata as JSON
 * @returns {Object} - The updated message object
 */
async function updateMessage(id, updateData) {
  try {
    // Update the message and retrieve the updated object
    const [updatedRows, [updatedMessage]] = await Message.update(updateData, {
      where: { id },
      returning: true, // Enable returning the updated object
    });

    if (updatedRows === 0) {
      throw new Error('Message not found or no changes made');
    }

    console.log('Message updated successfully:', updatedMessage);
    return updatedMessage;
  } catch (error) {
    console.error('Error updating message:', error.message);
    throw new Error('Unable to update message');
  }
}

module.exports = { updateMessage };
