const { JWT } = require('../../../config/constants');

const generateToken = async function (payload, expiry) {
  try {
    const token = await JWT.sign(
      //payload
      payload,

      //secret key
      process.env.JWT_KEY,

      //expiration time
      {
        expiresIn: expiry,
      }
    );

    return token;
  } catch (error) {

  }
};


const extractDetailsFromToken = async function (token) {
  try {
    // Verify and decode the token
    const decoded = JWT.verify(token, process.env.JWT_KEY);
    // Return the decoded payload (user details, including user ID)
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken, extractDetailsFromToken };
