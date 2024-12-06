const { getRedisClient } = require('../../../config/redis');

const deleteCache = async function (key) {
  try {
    const redisClient = getRedisClient();
    const value = await redisClient.del(key);

    return { isError: false, data: value };
  } catch (error) {
    console.log('error in delete cache helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = { deleteCache };
