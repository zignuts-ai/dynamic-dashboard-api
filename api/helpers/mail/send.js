const { SMTP_TRANSPORT } = require('../../../config/nodemailer');

const send = async function (
  mailFrom,
  mailTo,
  mailSubject,
  mailBody,
  mailCc,
  attachments = []
) {
  try {
    let mailOptions = {
      to: mailTo,
      from: mailFrom,
      subject: mailSubject,
      attachments: attachments,
      html: mailBody,
      cc: mailCc ? mailCc : '',
    };

    // Sends email asynchronously and capturing the response
    SMTP_TRANSPORT.sendMail(mailOptions, (err) => {
      // Handle the error if any and return the mailError exit route
      if (err) {
        return { isError: true, data: err.message || err };
      }
      // Mail has been sent successfully.
      return { isError: false, data: true };
    });
  } catch (error) {
    return { isError: true, data: error.message || error };
  }
};

module.exports = { send };
