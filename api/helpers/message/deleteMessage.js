const Message = require('../../models/Message'); // Adjust the path to your Message model

/**
 * Helper to delete a message
 * @param {string} id - The ID of the message to delete
 * @returns {string} - Confirmation message after deletion
 */
async function deleteMessage(id) {
  try {
    // Check if the message exists
    const message = await Message.findByPk(id);

    if (!message) {
      throw new Error('Message not found');
    }

    // Delete the message
    await Message.destroy({ where: { id } });

    return `Message with ID ${id} has been deleted successfully.`;
  } catch (error) {
    console.error('Error deleting message:', error.message);
    throw new Error('Unable to delete message');
  }
}

module.exports = { deleteMessage };
