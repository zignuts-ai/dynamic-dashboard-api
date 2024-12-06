const {
  HTTP_STATUS_CODE,
  FILE_CONSTANTS,
  DRIVERS,
} = require('../../../config/constants');
const { storageCore } = require('../../helpers/storage/core/core');
const { fileValidation } = require('../../utils/fileValidation');

module.exports = {
  /**
   * @name login
   * @file StorageController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description upload file
   * @author Jainam Shah (Zignuts)
   */
  upload: async (req, res) => {
    try {
      let files = req.files;

      /* call file validation and upload it in storage helper function with necessary informations
      like new file path or folder structure, uploaded file data, valid content types's array and errorcode,
      max file size value and errorcode, current user's id */
      const fileUpload = await fileValidation(
        FILE_CONSTANTS.UPLOAD.PATH + FILE_CONSTANTS.TEST.PATH,
        files,
        FILE_CONSTANTS.TEST.CONTENT_TYPES,
        'Only .png, .jpg, .jpeg and .svg files are allowed.',
        FILE_CONSTANTS.TEST.SIZE,
        'The file size should not be greater than 10mb.',
        'test id',
        req.body.compress || false,
        false
      );

      //if there is an error then send validation response
      if (fileUpload.isError) {
        //return response
        return res
          .status(
            fileUpload.isServerError
              ? HTTP_STATUS_CODE.SERVER_ERROR
              : HTTP_STATUS_CODE.BAD_REQUEST
          )
          .json({
            status: fileUpload.isServerError
              ? HTTP_STATUS_CODE.SERVER_ERROR
              : HTTP_STATUS_CODE.BAD_REQUEST,
            errorCode: '',
            message: fileUpload.isServerError ? '' : fileUpload.data,
            data: '',
            error: fileUpload.isServerError ? fileUpload.data : '',
          });
      }

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        errorCode: '',
        message: req.__('File.Uploaded'),
        data: fileUpload.data,
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        errorCode: '',
        message: '',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name delete
   * @file StorageController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description delete file
   * @author Jainam Shah (Zignuts)
   */
  delete: async (req, res) => {
    try {
      const { key } = req.body;

      // delete file to storage
      let fileDelete = await storageCore(DRIVERS.STORAGE_ACTIONS.DELETE_FILE, {
        sourceFilePath: key,
        fileKey: [{ Key: key }],
      });

      //if there is an error then send validation response
      if (fileDelete.isError) {
        //return response
        return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
          status: HTTP_STATUS_CODE.SERVER_ERROR,
          errorCode: '',
          message: '',
          data: '',
          error: fileDelete.data,
        });
      }

      //return response
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_STATUS_CODE.OK,
        errorCode: '',
        message: req.__('File.Deleted'),
        data: fileDelete.data,
        error: '',
      });
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        errorCode: '',
        message: '',
        data: '',
        error: error.message,
      });
    }
  },

  /**
   * @name download
   * @file StorageController.js
   * @param {Request} req
   * @param {Response} res
   * @throwsF
   * @description download file
   * @author Jainam Shah (Zignuts)
   */
  download: async (req, res) => {
    try {
      const { key } = req.query;

      // delete file to storage
      let fileDownload = await storageCore(
        DRIVERS.STORAGE_ACTIONS.DOWNLOAD_FILE,
        {
          sourceFilePath: key,
          key,
        }
      );

      //if there is an error then send validation response
      if (fileDownload.isError) {
        //return response
        return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
          status: HTTP_STATUS_CODE.SERVER_ERROR,
          errorCode: '',
          message: '',
          data: '',
          error: fileDownload.data,
        });
      }

      /* handle file name and content type from your end dynamically
      with finding data in media table or where key and url is stored in database
      or manually add that */
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename=data.png`);

      return res.send(fileDownload.data);
    } catch (error) {
      //return error response
      return res.status(HTTP_STATUS_CODE.SERVER_ERROR).json({
        status: HTTP_STATUS_CODE.SERVER_ERROR,
        errorCode: '',
        message: '',
        data: '',
        error: error.message,
      });
    }
  },
};
