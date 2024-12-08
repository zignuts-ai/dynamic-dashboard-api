const { UUID, HTTP_STATUS_CODE } = require("../../../config/constants");
const { Message } = require("../../models");

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
  createMessage: async (req, res) => {
    try {
      const { user } = req ?? {};
      const { message, sessionId, type } = req.body;
      const userId = user?.id || sessionId;
      const id = UUID();
      const response = await Message.create({
        id,
        name: "User",
        type,
        message: message,
        metadata: {},
        sessionId,
        userId: userId,
        createdBy: userId,
        updatedAt: Math.floor(Date.now() / 1000),
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        message: "",
        data: response,
        error: "",
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
