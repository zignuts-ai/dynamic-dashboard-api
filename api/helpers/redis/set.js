const { getRedisClient } = require('../../../config/redis');

const setCache = async function (key, value, expiry) {
  try {
    const redisClient = getRedisClient();
    await redisClient.set(key, value, expiry ? { EX: expiry } : '');

    return { isError: false, data: true };
  } catch (error) {
    console.log('error in set cache helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = { setCache };
