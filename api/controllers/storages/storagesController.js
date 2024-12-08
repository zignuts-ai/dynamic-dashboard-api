const path = require("path");
const fs = require("fs");
const { GENERATED_VIDEO_PATH } = require("../../../config/constants");

const videosDir = path.join(__dirname, GENERATED_VIDEO_PATH);
module.exports = {
  /**
   * @name download
   * @file StorageController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description download file
   * @author Jainam Shah (Zignuts)
   */

  getStroage: async (req, res) => {
    try {
      const { filename } = req.params;
      const videoPath = path.join(videosDir, filename);

      // Check if the file exists
      fs.access(videoPath, fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(404).json({ error: "File not found" });
        }

        // Serve the file
        res.sendFile(videoPath);
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        errorCode: "",
        message: "",
        data: "",
        error: error.message,
      });
    }
  },
};
