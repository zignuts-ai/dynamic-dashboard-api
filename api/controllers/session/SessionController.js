const {
  HTTP_STATUS_CODE,
  CONTENT_TYPES,
  VALIDATOR,
  UUID,
} = require("../../../config/constants");
const { VALIDATION_RULES } = require("../../../config/validationRules");
const { Session } = require("../../models");
const { getKeywords } = require("../chatgpt/ChatGptController");



module.exports = {
  /**
   * @name generateKeywords
   * @file ChatGptController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description Get keywords(User Panel)
   * @author Jainam Shah (Zignuts)
   */
  createSession: async (req, res) => {
    console.log('createSession: ');
    try {
        const userId =  req.me.id;
        const { prompt, sessionId} = req.body;
     
        let validationObject = {
          prompt: VALIDATION_RULES.SESSION.PROMPT,
          sessionId: VALIDATION_RULES.SESSION.SESSIONID,
        };
        let validationData = {
          prompt, sessionId
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


    
      // const id = UUID();
      // Create a new user in the database
      let newSession = await Session.create({
        id: sessionId,
        prompt: prompt,
        sessionId: sessionId,
        userId: userId,
        createdBy: id,
        updatedBy: id,
      });


      
          // Return success response with the user data and token
          return res.status(HTTP_STATUS_CODE.OK).json({
            status: HTTP_STATUS_CODE.OK,
            message: req.__('Session.Created'), // Modify this message if needed
            data: { session: newSession },
            error: '',
          });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        message: "",
        data: "",
        error: error.message,
      });
    }
  },

};
