module.exports = {
  socketsOptions: {
    transports: ['websocket'],
    transportOptions: {
      polling: {
        extraHeaders: {
          'x-forwarded-for': '127.0.0.1:3001', // Or use a suitable header
        },
      },
    },
    allowUpgrades: true,
    path: '/socket.io',
  },
};
