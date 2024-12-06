const { getRedisClient } = require('../../../config/redis');

const getCache = async function (key) {
  try {
    const redisClient = getRedisClient();
    const value = await redisClient.get(key);

    return { isError: false, data: value };
  } catch (error) {
    console.log('error in get cache helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = { getCache };
