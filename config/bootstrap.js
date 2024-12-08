// const { DRIVERS, FS } = require('./constants');

const { imageGeneration } = require("../api/helpers/chatgpt/imageGeneration");
const { Admin } = require("../api/models");

module.exports.bootstrap = async () => {
  // By convention, this is a good place to set up fake data during development.
  // ----------------------------------*----------------------------------------
  try {
    //   if (!process.env.STORAGE_DRIVER) throw 'Please pass storage driver';
    //   if (!process.env.QUEUE_DRIVER) throw 'Please pass queue driver';
    //   if (process.env.STORAGE_DRIVER === DRIVERS.STORAGE.FILE_SYSTEM) {
    //     if (
    //       !process.env.STATIC_UPLOAD_BASE_PATH ||
    //       !FS.existsSync(
    //         process.env.STATIC_FOLDER + process.env.STATIC_UPLOAD_BASE_PATH
    //       )
    //     )
    //       throw 'File directory is missing or not exists in server';
    //   } else if (process.env.STORAGE_DRIVER === DRIVERS.STORAGE.AWS_S3) {
    //     if (
    //       !process.env.AWS_S3_REGION ||
    //       !process.env.AWS_S3_ACCESS_KEY ||
    //       !process.env.AWS_S3_SECRET_KEY ||
    //       !process.env.AWS_S3_BUCKET
    //     )
    //       throw 'AWS S3 credentials are missing';
    //   }
    //   if (process.env.QUEUE_DRIVER === DRIVERS.QUEUE.SQS) {
    //     if (
    //       !process.env.AWS_SQS_REGION ||
    //       !process.env.AWS_SQS_ACCESS_KEY ||
    //       !process.env.AWS_SQS_SECRET_KEY ||
    //       !process.env.AWS_NOTIFICATION_QUEUE_URL
    //     )
    //       throw 'AWS SQS credentials are missing';
    //   } else if (process.env.QUEUE_DRIVER === DRIVERS.QUEUE.DATABASE) {
    //     if (!process.env.DB_URL) throw 'Database url is missing';
    //   }
    // let admin = await Admin.findAll({
    //   limit: 1,
    //   attributes: ['id'],
    // });
    //create admin in db if not exist
    // if (admin.length === 0) {
    //   const adminId = UUID();
    //   await Admin.create({
    //     id: adminId,
    //     name: 'Super Admin',
    //     email: 'superadmin@yopmail.com',
    //     password:
    //       '$2a$10$pYQkBJ5Od.jgLJOk4mkVNuR2ROcORjjIOu3qR9Vzsg5nba08Pqj0.',
    //     createdBy: adminId,
    //     createdAt: Math.floor(Date.now() / 1000),
    //   });
    // }
    //pre data load in db
    // let countries = await MstCountry.findAll({
    //   limit: 1,
    // });
    // if (countries.length === 0) {
    //   const DATA = require('./preData/index');
    //   await Promise.all([
    //     MstCountry.bulkCreate(DATA.COUNTRY, { validate: true }),
    //     MstCountryTrans.bulkCreate(DATA.COUNTRY_TRANS, { validate: true }),
    //   ]);
    // }
  } catch (error) {
    throw error;
  }
};
