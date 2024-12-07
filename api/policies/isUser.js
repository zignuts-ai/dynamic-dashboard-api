const { HTTP_STATUS_CODE, JWT, USER_ROLES } = require('../../config/constants');
const { User } = require('../models');

module.exports.checkUserOrGuest = async (req, res, next) => {
  try {
    // Getting authToken from headers for both logged-in user and guest user
    let authToken = req.headers['authorization'] || req.headers['auth_token'];

    if (!authToken) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: req.__('User.Auth.TokenNotFound'),
      });
    }

    // Check if the token starts with Bearer, and extract the token value
    if (authToken.startsWith('Bearer ')) {
      authToken = authToken.split(' ')[1];
    } else {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: req.__('User.Auth.TokenNotFound'),
      });
    }

    // First, try to verify as a logged-in user with the user token
    try {
      let decodedToken = await JWT.verify(authToken, process.env.JWT_KEY);
      
      // If the decoded token is valid for the user, check the database
      if (decodedToken && decodedToken.id) {
        let user = await User.findOne({
          where: {
            id: decodedToken.id,
            // role: USER_ROLES.OWNER,
            isDeleted: false,
          },
          attributes: ['id', 'email', 'name', 'token'],
        });

        if (!user || user.token !== authToken) {
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODE.UNAUTHORIZED,
            message: req.__('User.Auth.Invalid'),
          });
        }

        req.me = user;
        return next(); // If logged-in user is valid, proceed with the request
      }
    } catch (userTokenError) {
      // If the user's token is invalid or expired, move to guest token check
    }

    // If the user token verification fails, check if it's a valid guest token
    try {
      let decodedToken = await JWT.verify(authToken, process.env.JWT_GUEST_SECRET);

      // If the decoded token is valid for the guest user, allow access
      if (  decodedToken &&
        decodedToken.exp &&
        decodedToken.exp > Math.floor(Date.now() / 1000)) {
        req.me = decodedToken; // Attach decoded guest token
        return next(); // Proceed with guest access
      }
    } catch (guestTokenError) {
      // If guest token is invalid or expired, throw an error
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_STATUS_CODE.UNAUTHORIZED,
        message: req.__('User.Auth.TokenExpired'),
      });
    }

    // If neither user nor guest token is valid
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
      status: HTTP_STATUS_CODE.UNAUTHORIZED,
      message: req.__('User.Auth.Invalid'),
    });

  } catch (error) {
    return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
      status: HTTP_STATUS_CODE.SERVER_ERROR,
      message: error.message,
    });
  }
};
