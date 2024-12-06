const { SQS_EVENTS, DRIVERS } = require('../../../config/constants');
const { queueCore } = require('../queue/core/core');
const { prepareTemplate } = require('./prepareTemplate');
const { send } = require('./send');

const processMailMsgs = async function ({ msgData, receiptHandle }) {
  try {
    let { subtype, payload } = msgData;

    // Get the template HTML
    let mailBody = await prepareTemplate(subtype, payload);

    //identifing the sub Type and handle cases according to that
    switch (subtype) {
      case SQS_EVENTS.MAIL.USER_FORGOT_PASSWORD:
        await send(
          process.env.SMTP_SENDER,
          payload.email,
          'Forgot password',
          mailBody,
          [
            // if there are any attachment
            // {
            //   filename: 'logo.png',
            //   path: `assets/templates/images/logo.png`,
            //   cid: 'logo',
            // },
          ]
        );
        break;

      default:
        break;
    }

    // delete the msg from the queue
    if (receiptHandle) {
      await queueCore(DRIVERS.QUEUE_ACTIONS.DELETE_MSG, {
        id: receiptHandle,
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { processMailMsgs };
