const {
  VALIDATOR,
  HTTP_STATUS_CODE,
  BCRYPT,
  TOKEN_EXPIRY,
  UUID,
  PAGE_NAMES,
  SQS_EVENTS,
} = require('../../../../config/constants');
const { VALIDATION_RULES } = require('../../../../config/validationRules');
const { generateToken } = require('../../../helpers/auth/generateToken');
const {
  processMailMsgs,
} = require('../../../helpers/mail/processMailMessages');
const { Admin } = require('../../../models');

module.exports = {
  /**
   * @name login
   * @file AuthController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Admin Login(Admin Panel)
   * @author Jainam Shah (Zignuts)
   */
  login: async (req, res) => {
    try {
      //get email password from body
      let { email, password } = req.body;

      /* The code block you mentioned is performing validation on the `email` and `password` fields
             received in the request body. */
      let validationObject = {
        email: VALIDATION_RULES.ADMIN.EMAIL,
        password: VALIDATION_RULES.ADMIN.PASSWORD,
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
          message: '',
          data: '',
          error: validation.errors.all(),
        });
      }

      /* The code is using the `findOne` method to find an admin in the `Admins` collection
            based on email. */
      let admin = await Admin.findOne({
        where: {
          email: email.toLowerCase(),
          isDeleted: false,
        },
        attributes: ['id', 'password', 'isActive'],
      });

      /* This code block is checking if the admin is found in the database or not. If the admin is not
             found, it returns a response with a status code of 400 (Bad Request) */
      if (!admin) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.InvalidCredential'),
          data: '',
          error: '',
        });
      }

      //if admin is not active then send error response
      if (!admin.isActive) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.NotActive'),
          data: '',
          error: '',
        });
      }

      /* This code is comparing the password entered by the admin with the hashed password stored in the
             database for the admin. */
      const comparePassword = await BCRYPT.compareSync(
        password,
        admin.password
      );

      /* This code block is checking if the entered password matches the hashed password stored in the
          database for the admin. If the passwords do not match, it returns a response with a status code
          of 400 (Bad Request) */
      if (!comparePassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.InvalidCredential'),
          data: '',
          error: '',
        });
      }

      /* The `payload` object is used to store the admin data that will be used to generate a token.*/
      const payload = {
        id: admin.id,
        email: email.toLowerCase(),
        name: admin.name,
      };

      /* This code is generating access and access tokens for the admin.*/
      const token = await generateToken(
        payload,
        TOKEN_EXPIRY.ADMIN_ACCESS_TOKEN
      );

      /* The code is updating the admin's token and last
            login timestamp in the database. */
      await admin.update({
        token,
        lastLoginAt: Math.floor(Date.now() / 1000),
      });

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('Admin.Auth.Login'),
        data: { admin: payload, token },
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
   * @description This method will send reset password link to admin's email
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
        email: VALIDATION_RULES.ADMIN.EMAIL,
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

      /* The code is using the `findOne` method to find an admin in the `Admins` collection
            based on email. */
      let admin = await Admin.findOne({
        where: {
          email: email.toLowerCase(),
          isDeleted: false,
        },
        attributes: ['id', 'name', 'isActive'],
      });

      /* This code block is checking if the admin is found in the database or not. If the admin is not
               found, it returns a response with a status code of 400 (Bad Request) */
      if (!admin) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.NotFound'),
          data: '',
          error: '',
        });
      }

      //if admin is not active then send error response
      if (!admin.isActive) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.NotActive'),
          data: '',
          error: '',
        });
      }

      //generating token
      const token = UUID();

      //sets forget password token expiry in seconds in admin data
      const forgotPwdExp =
        Math.floor(Date.now() / 1000) +
        TOKEN_EXPIRY.ADMIN_FORGOT_PASSWORD_TOKEN;

      //updating token for admin
      await admin.update({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: forgotPwdExp,
      });
      /* The below code is sending a message to a queue for processing. It creates a payload object
            with properties email, name, and token. Then, it uses the queue helper
            function to send a message to the queue with particular type (Mail), subtype (admin-forgot-password) The message type is set to EVENT_TYPES.MAIL  */

      const payload = {
        email: email.toLowerCase(),
        name: admin.name,
        url: `${process.env.FRONTEND_BASE_URL}${PAGE_NAMES.ADMIN_RESET_PASSWORD}?id=${admin.id}&token=${token}`,
        token,
      };

      //send mail
      processMailMsgs({
        msgData: {
          subtype: SQS_EVENTS.MAIL.ADMIN_FORGOT_PASSWORD,
          payload: payload,
        },
      }).catch(async (err) => {
        throw err;
      });

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('Admin.Auth.MailSend'),
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
   * @author Jainam Shah (Zignuts)
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
        id: VALIDATION_RULES.ADMIN.ID,
        password: VALIDATION_RULES.ADMIN.PASSWORD,
        token: VALIDATION_RULES.ADMIN.FORGOT_PWD_TOKEN,
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

      //check for admin with provided id in database
      const admin = await Admin.findOne({
        where: {
          id,
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

      //if admin is not valid then sends validation response
      if (!admin) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.NotFound'),
          data: '',
          error: '',
        });
      }

      // compares admin password with given password
      const comparePassword = await BCRYPT.compareSync(
        password,
        admin.password
      );

      // if same password as old password
      if (comparePassword) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.PasswordMatch'),
          data: '',
          error: '',
        });
      }

      //check for forgot password token
      if (admin.forgotPasswordToken !== token) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //gets forget password token expiry from admin data in milliseconds
      const forgotPwdTokenExpiry = admin.forgotPasswordTokenExpiry * 1000;

      //checks for forget password token expiry
      if (forgotPwdTokenExpiry < Date.now()) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //hash the new password with bcrypt package
      const hash = await BCRYPT.hashSync(password, 10);

      //update password for the admin and set null values to forget password token and its expiry in database
      await admin.update({
        password: hash,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: 0,
        token: null,
      });

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: req.__('Admin.Auth.PasswordChange'),
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
        id: VALIDATION_RULES.ADMIN.ID,
        token: VALIDATION_RULES.ADMIN.FORGOT_PWD_TOKEN,
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

      //check for admin with provided id in database
      const admin = await Admin.findOne({
        where: {
          id,
          isDeleted: false,
        },
        attributes: [
          'id',
          'isActive',
          'forgotPasswordToken',
          'forgotPasswordTokenExpiry',
        ],
      });

      //if admin is not valid then sends validation response
      if (!admin) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.NotFound'),
          data: '',
          error: '',
        });
      }

      //check for forgot password token
      if (admin.forgotPasswordToken !== token) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.InvalidLink'),
          data: '',
          error: '',
        });
      }

      //gets forget password token expiry from user data in miliseconds
      const forgotPwdTokenExpiry = admin.forgotPasswordTokenExpiry * 1000;

      //checks for forget password token expiry
      if (forgotPwdTokenExpiry < Date.now()) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_STATUS_CODE.BAD_REQUEST,
          message: req.__('Admin.Auth.InvalidLink'),
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
      await Admin.update(
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
        message: req.__('Admin.Auth.Logout'),
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
