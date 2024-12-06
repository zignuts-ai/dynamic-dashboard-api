const {
  VALIDATOR,
  HTTP_STATUS_CODE,
  BCRYPT,
  TOKEN_EXPIRY,
  USER_ROLES,
  UUID,
  PAGE_NAMES,
  SQS_EVENTS,
} = require('../../../../config/constants');
const { VALIDATION_RULES } = require('../../../../config/validationRules');
const { generateToken } = require('../../../helpers/auth/generateToken');
const {
  processMailMsgs,
} = require('../../../helpers/mail/processMailMessages');
const { User } = require('../../../models');

module.exports = {
  /**
   * @name login
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description User Login(User Panel)
   * @author Jainam Shah (Zignuts)
   */
  login: async (req, res) => {
    try {
      //get email password from body
      let { email, password } = req.body;

      /* The code block you mentioned is performing validation on the `email` and `password` fields
         received in the request body. */
      let validationObject = {
        email: VALIDATION_RULES.USERS.EMAIL,
        password: VALIDATION_RULES.USERS.PASSWORD,
      };

      let validationData = {
        email,
        password,
      };

      let validation = new VALIDATOR(validationData, validationObject);

      if (validation.fails()) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Validation error',
          data: '',
          error: validation.errors.all(),
        });
      }

      /* The code is using the `findOne` method to find a user in the `Users` collection
        based on role. */
      let user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          role: USER_ROLES.OWNER,
          isDeleted: false,
        },
        attributes: ['id', 'password', 'isActive'],
      });

      /* This code block is checking if the user is found in the database or not. If the user is not
         found, it returns a response with a status code of 400 (Bad Request) */
      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.InvalidCredential'),
          data: '',
          error: '',
        });
      }

      //if user is not active then send error response
      if (!user.isActive) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.NotActive'),
          data: '',
          error: '',
        });
      }

      /* This code is comparing the password entered by the user with the hashed password stored in the
         database for the user. */
      const comparePassword = await BCRYPT.compareSync(password, user.password);

      /* This code block is checking if the entered password matches the hashed password stored in the
      database for the user. If the passwords do not match, it returns a response with a status code
      of 400 (Bad Request) */
      if (!comparePassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.InvalidCredential'),
          data: '',
          error: '',
        });
      }

      /* The `payload` object is used to store the user data that will be used to generate a token.*/
      const payload = {
        id: user.id,
        email: email.toLowerCase(),
        name: user.name,
      };

      /* This code is generating access and refresh tokens for the user.*/
      const token = await generateToken(
        payload,
        TOKEN_EXPIRY.USER_ACCESS_TOKEN
      );

      /* The code is updating the user's token and last
         login timestamp in the database. */
      await user.update({ token, lastLoginAt: Math.floor(Date.now() / 1000) });

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('User.Auth.Login'),
        data: { user: payload, token },
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: '',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name forgotPassword
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method will send reset password link to user's email
   * @author Jainam Shah (Zignuts)
   */
  forgotPassword: async (req, res) => {
    try {
      //get email from body
      const { email } = req.body;

      /* The below code is performing validation on an email address. It creates a validation object
        with a rule for email validation. It then creates a validation data object with the email to
        be validated. It uses a validator class to perform the validation and checks if any rules are
        violated. If any rule is violated, it returns a response with a bad request status code and an
        error message. */
      const validationObject = {
        email: VALIDATION_RULES.USERS.EMAIL,
      };

      const validationData = {
        email,
      };

      const validation = new VALIDATOR(validationData, validationObject);

      if (validation.fails()) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Validation error',
          data: '',
          error: validation.errors.all(),
        });
      }

      /* The code is using the `findOne` method to find a user in the `Users` collection
        based on role. */
      let user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          role: USER_ROLES.OWNER,
          isDeleted: false,
        },
        attributes: ['id', 'name', 'isActive'],
      });

      /* This code block is checking if the user is found in the database or not. If the user is not
           found, it returns a response with a status code of 400 (Bad Request) */
      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.NotFound'),
          data: '',
          error: '',
        });
      }

      //if user is not active then send error response
      if (!user.isActive) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.NotActive'),
          data: '',
          error: '',
        });
      }

      //generating token
      const token = UUID();

      //sets forget password token expiry in seconds in user data
      const forgotPwdExp =
        Math.floor(Date.now() / 1000) + TOKEN_EXPIRY.USER_FORGOT_PASSWORD_TOKEN;

      //updating token for user
      await user.update({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: forgotPwdExp,
      });
      /* The below code is sending a message to a queue for processing. It creates a payload object
        with properties email, name, and token. Then, it uses the queue helper
        function to send a message to the queue with particular type (Mail), subtype (user-forgot-password) The message type is set to EVENT_TYPES.MAIL and the
        and queue type (Notification) */
      const payload = {
        email: email.toLowerCase(),
        name: user.name,
        url: `${process.env.FRONTEND_BASE_URL}${PAGE_NAMES.USER_RESET_PASSWORD}?id=${user.id}&token=${token}`,
        token,
      };

      //send mail
      processMailMsgs({
        subtype: SQS_EVENTS.MAIL.USER_FORGOT_PASSWORD,
        payload: payload,
      }).catch(async (err) => {
        throw err;
      });

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('User.Auth.MailSend'),
        data: '',
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: '',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name resetPassword
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method will check token and its expiry then reset the password in system
   * @author Jainam Shah  (Zignuts)
   */
  resetPassword: async (req, res) => {
    try {
      //get id, password, forget password token from body
      const { id, password, token } = req.body;

      /* The below code is performing validation on the `validationData` object using the
        `validationObject` rules. It creates a new instance of the `VALIDATOR` class and passes the
        `validationData` and `validationObject` as arguments. If any validation rule is violated, it
        returns a response with a status code of 400 (Bad Request) and an error message. */
      const validationObject = {
        id: VALIDATION_RULES.USERS.ID,
        password: VALIDATION_RULES.USERS.PASSWORD,
        token: VALIDATION_RULES.USERS.FORGOT_PWD_TOKEN,
      };

      const validationData = {
        id,
        password,
        token,
      };

      const validation = new VALIDATOR(validationData, validationObject);

      if (validation.fails()) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Validation error',
          data: '',
          error: validation.errors.all(),
        });
      }

      //check for user with provided id in database
      const user = await User.findOne({
        where: {
          id,
          role: USER_ROLES.OWNER,
          isDeleted: false,
        },
        attributes: [
          'id',
          'password',
          'isActive',
          'forgotPasswordToken',
          'forgotPasswordTokenExpiry',
        ],
      });

      //if user is not valid then sends validation response
      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.NotFound'),
          data: '',
          error: '',
        });
      }

      // compares user password with given password
      const comparePassword = await BCRYPT.compareSync(password, user.password);

      // if same password as old password
      if (comparePassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.PasswordMatch'),
          data: '',
          error: '',
        });
      }

      //check for forgot password token
      if (user.forgotPasswordToken !== token) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //gets forget password token expiry from user data in miliseconds
      const forgotPwdTokenExpiry = user.forgotPasswordTokenExpiry * 1000;

      //checks for forget password token expiry
      if (forgotPwdTokenExpiry < Date.now()) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //hash the new password with bcrypt package
      const hash = await BCRYPT.hashSync(password, 10);

      //update password for the user and set null values to forget password token and its expiry in database
      await user.update({
        password: hash,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: 0,
        token: null,
      });

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('User.Auth.PasswordChange'),
        data: '',
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: '',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name checkToken
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description check user forgot password token expiry time
   * @author Jainam Shah (Zignuts)
   */
  checkToken: async (req, res) => {
    try {
      //get id, token from body
      let { id, token } = req.body;

      /* The below code is performing validation on the `validationData` object using the
        `validationObject` rules. It creates a new instance of the `VALIDATOR` class and passes the
        `validationData` and `validationObject` as arguments. If any validation rule is violated, it
        returns a response with a status code of 400 (Bad Request) and an error message. */
      const validationObject = {
        id: VALIDATION_RULES.USERS.ID,
        token: VALIDATION_RULES.USERS.FORGOT_PWD_TOKEN,
      };

      // construct validation data
      const validationData = {
        id,
        token,
      };

      // define validation and perform validation and throw error if any
      const validation = new VALIDATOR(validationData, validationObject);

      // if validation fails return error
      if (validation.fails()) {
        //if any rule is violated
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: 'Validation error',
          data: '',
          error: validation.errors.all(),
        });
      }

      //check for user with provided id in database
      const user = await User.findOne({
        where: {
          id,
          role: USER_ROLES.OWNER,
          isDeleted: false,
        },
        attributes: [
          'id',
          'isActive',
          'forgotPasswordToken',
          'forgotPasswordTokenExpiry',
        ],
      });

      //if user is not valid then sends validation response
      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.NotFound'),
          data: '',
          error: '',
        });
      }

      //check for forgot password token
      if (user.forgotPasswordToken !== token) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //gets forget password token expiry from user data in miliseconds
      const forgotPwdTokenExpiry = user.forgotPasswordTokenExpiry * 1000;

      //checks for forget password token expiry
      if (forgotPwdTokenExpiry < Date.now()) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('User.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: '',
        data: { expired: false },
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: '',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name logout
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description This method logs out the User
   * @author Jainam Shah (Zignuts)
   */
  logout: async (req, res) => {
    try {
      //update token values to null in user's data
      await User.update(
        {
          token: null,
          lastLogoutAt: Math.floor(Date.now() / 1000),
        },
        {
          where: {
            id: req.me.id,
            isDeleted: false,
            isActive: true,
          },
        }
      );

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('User.Auth.Logout'),
        data: '',
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: '',
        data: '',
        error: error.message,
      });
    }
  },
};
