const { HTTP_STATUS_CODE, JWT, USER_ROLES } = require('../../config/constants');
const { User } = require('../models');

module.exports.isGuestUser = async (req, res, next) => {
  try {
    // Get the authToken from headers
    let authToken = req.headers['authorization'];

    // Check if authToken starts with Bearer and fetch the token
    if (authToken && authToken.startsWith('Bearer ')) {
      authToken = authToken.split(' ')[1];
    } else {
      authToken = null; // No token provided, treating as guest user
    }

    if (authToken) {
      try {
        // Verify JWT token
        let decodedToken = await JWT.verify(authToken, process.env.JWT_KEY);
        console.log('decodedToken: ', decodedToken);

        // Check token expiration
        if (
          decodedToken &&
          decodedToken.exp &&
          decodedToken.exp > Math.floor(Date.now() / 1000) &&
          decodedToken.id
        ) {
          let user = await User.findOne({
            where: {
              id: decodedToken.id,
              isDeleted: false,
            },
            attributes: ['id', 'email', 'name', 'token'],
          });

          if (user) {
            // Verify token matches stored token
            if (user.token === authToken) {
              req.me = user; // Authenticated user
              return next();
            } else {
              console.warn('Token mismatch for user ID:', decodedToken.id);
            }
          } else {
            console.warn('User not found for ID:', decodedToken.id);
          }
        }
      } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
          console.warn('Token expired:', error.message);
        } else {
          console.warn('Token verification error:', error.message);
        }
      }
    }

    // If no valid token, proceed as guest user
    req.me = { role: USER_ROLES.GUEST }; // Assign default guest role
    next();
  } catch (error) {
    // Handle server error
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      errorCode: '',
      message: 'An unexpected error occurred.',
      data: '',
      error: error.message,
    });
  }
};
