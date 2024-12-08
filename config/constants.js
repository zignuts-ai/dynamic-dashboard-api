require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { OpenAI } = require("openai");
const JWT = require("jsonwebtoken");
const BCRYPT = require("bcryptjs");
const { Op } = require("sequelize");
const { DataTypes } = require("sequelize");
const PATH = require("path");
const HANDLEBARS = require("handlebars");
const VALIDATOR = require("validatorjs");
const FS = require("fs");
const UTIL = require("util");
const MULTER = require("multer");
const SHARP = require("sharp");
const axios = require("axios");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const RUNWAY_API_KEY = process.env.RUN_WAY_API_KEY;
const RUNWAY_API_URL = "https://api.runwayml.com/v3/generate/video";
const MODAL_TYPE = {CHATGPT:"chatgpt",GROQ:"groq"}
const DRIVERS = {
  STORAGE: {
    AWS_S3: "s3",
    FILE_SYSTEM: "fs",
  },
  QUEUE: {
    SQS: "sqs",
    DATABASE: "database",
  },
  STORAGE_ACTIONS: {
    UPLOAD_FILE: "uploadFile",
    DELETE_FILE: "deleteFile",
    DOWNLOAD_FILE: "downloadFile",
  },
  QUEUE_ACTIONS: {
    SEND_MSG: "sendMsg",
    RECEIVE_MSGS: "receiveMsgs",
    DELETE_MSG: "deleteMsg",
  },
};

// AWS setup
const AWS_S3 = require("aws-sdk");
AWS_S3.config = new AWS_S3.Config({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});
// create new s3 instance
const S3 = new AWS_S3.S3({ apiVersion: "2006-03-01" });

let AWS_SQS = require("aws-sdk");
AWS_SQS.config = new AWS_SQS.Config({
  accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SQS_SECRET_KEY,
  region: process.env.AWS_SQS_REGION,
});
const SQS = new AWS_SQS.SQS({
  apiVersion: "2012-11-05",
});

// Response Codes
const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
};

const SQS_EVENTS = {
  MAIL: {
    USER_FORGOT_PASSWORD: "user-forgot-password",
    ADMIN_FORGOT_PASSWORD: "admin-forgot-password",
  },
};

const EVENT_TYPES = {
  MAIL: "M",
  NOTIFICATION: "N",
  ERROR: "E",
  REPORT: "R",
};

const PAGE_NAMES = {
  ADMIN_RESET_PASSWORD: "reset-password",
  USER_RESET_PASSWORD: "reset-password",
};

const STATUS = {
  MEDIA: {
    UPLOADED: "uploaded",
    FAIL: "failed",
    ATTACHED: "attached",
  },
  SQS: {
    PENDING: "P",
    IN_PROGRESS: "IP",
    ERROR: "E",
  },
};

// JWT Expiry
const TOKEN_EXPIRY = {
  USER_ACCESS_TOKEN: "1d",
  ADMIN_ACCESS_TOKEN: "1d",
  USER_FORGOT_PASSWORD_TOKEN: 60 * 60, // 1 hour
  ADMIN_FORGOT_PASSWORD_TOKEN: 5 * 60, // 5 minutes
};

const TEMPLATE_BASE_PATH = "assets/templates";

const FILE_CONSTANTS = {
  TYPES: {
    IMAGE: {
      FLAG: "I",
      CONTENT_TYPES: ["image/png", "image/jpg", "image/jpeg"],
    },
    VIDEO: {
      FLAG: "V",
      CONTENT_TYPES: ["video/quicktime", "video/x-ms-wmv", "video/mp4"],
    },
  },
  UPLOAD: {
    PATH: "uploads/",
  },
  TEST: {
    PATH: "test/",
    SIZE: 10 * 1024 * 1024,
    CONTENT_TYPES: ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"],
  },
  MAX_SIZE: 1 * 1024 * 1024 * 1024, // 1 GB file size limit
};

const DEVICE_TYPE = {
  WEB: "web",
  ANDROID: "android",
  IOS: "ios",
};

const USER_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  USER: "user",
};

const CONTENT_TYPES = {
  TEXT: "text",
  MEME: "meme",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
};

// Export constants
module.exports = {
  UUID: uuidv4,
  CONTENT_TYPES,
  JWT,
  BCRYPT,
  Op,
  DataTypes,
  PATH,
  HANDLEBARS,
  VALIDATOR,
  FS,
  UTIL,
  MULTER,
  SHARP,
  DRIVERS,
  S3,
  SQS,
  HTTP_STATUS_CODE,
  SQS_EVENTS,
  EVENT_TYPES,
  PAGE_NAMES,
  STATUS,
  TOKEN_EXPIRY,
  TEMPLATE_BASE_PATH,
  FILE_CONSTANTS,
  DEVICE_TYPE,
  USER_ROLES,
  openai,
  RUNWAY_API_KEY,
  RUNWAY_API_URL,
  axios,
  groq
  MODAL_TYPE
};
