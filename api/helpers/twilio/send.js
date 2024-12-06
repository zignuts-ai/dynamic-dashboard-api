const send = async function (messageData, phone) {
  const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
    {
      lazyLoading: true,
    }
  );
  try {
    /* The code snippet `await client.messages.create({ body: messageData, from: phoneNumber,
     smartEncoded: true, to: phone })` is using the Twilio API to send a text message. Here's a
     breakdown of what each parameter does: */
    await client.messages
      .create({
        body: messageData,
        from: process.env.TWILIO_PHONE_NUMBER,
        smartEncoded: true,
        to: phone,
      })
      .then((message) => {
        return { isError: false, data: message };
      })
      .catch((err) => {
        console.log('error in twilio', err);
        return { isError: true, data: err?.message || err };
      });
  } catch (error) {
    console.log('error in twilio send helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = { send };
