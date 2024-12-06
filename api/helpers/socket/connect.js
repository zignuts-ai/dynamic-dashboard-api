/**
 * Centralized module for managing the Socket.IO server instance.
 */

const { cors } = require('../../../config/security');
const { socketsOptions } = require('../../../config/sockets');

// Store the single instance of the Socket.IO server
let io;

/**
 * Initializes and configures the Socket.IO server. Connects to an optional
 * Redis adapter for scaling and pub/sub functionality.
 *
 * @param {Object} app - The Express.js application instance.
 * @returns {Server} - The initialized Socket.IO server instance.
 * @throws {Error} - If there is an error during initialization.
 */
const connectSocketIO = async (server) => {
  if (io) {
    console.warn('Socket.IO is already initialized. Skipping.');
    return io;
  }
  try {
    io = require('socket.io')(server, {
      ...socketsOptions,
      pingTimeout: 60000,
      cors,
    });

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('error', (error) => {
        console.error(`Socket error: ${error.message}`);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    console.log('Socket.IO initialized successfully.');

    return io; // Return the instance to use for events, etc.
  } catch (error) {
    // Important! Provide more context:
    console.error('Error initializing Socket.IO:', error);
    throw error;
  }
};

module.exports = {
  connectSocketIO,
};
