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
  create: async (req, res) => {
    try {
      const userId = req.me.id || null;
      const { prompt, sessionId } = req.body;

    }
  },
};
