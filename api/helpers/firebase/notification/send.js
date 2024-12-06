const { DEVICE_TYPE } = require('../../../../config/constants');

const send = async function ({ toUser, type, title, body, data }) {
  try {
    const firebaseAdmin = require('firebase-admin');
    const serviceAccount = require('./xyz.json');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });

    const FCM = firebaseAdmin.messaging();

    // find user
    let user = await User.findAll({
      where: { id: toUser },
      attributes: ['id', 'deviceToken', 'deviceType', 'language'],
    });

    let andriodUserDeviceToken = [];
    let iosUserDeviceToken = [];
    let webUserDeviceToken = [];

    // fetch only user having device token
    user.filter((item) => {
      if (item.deviceToken !== null && item?.deviceToken != '') {
        if (item.deviceType == DEVICE_TYPE.ANDROID) {
          andriodUserDeviceToken.push(item.deviceToken);
        }
        if (item.deviceType == DEVICE_TYPE.IOS) {
          iosUserDeviceToken.push(item.deviceToken);
        }
        if (item.deviceType == DEVICE_TYPE.WEB) {
          webUserDeviceToken.push(item.deviceToken);
        }
      }
    });

    // payload to send notification to android devices
    if (andriodUserDeviceToken.length > 0) {
      let message = {
        data: {
          title,
          type,
          body,
        },
        token: andriodUserDeviceToken,
        android: {
          notification: {
            sound: 'default',
          },
        },
      };

      //if there are addtional data to send
      if (data) {
        message.data = { ...message.data, data };
      }

      // send notification
      FCM.sendEachForMulticast(message)
        .then(async (response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }

    // payload to send notification to web devices
    if (webUserDeviceToken.length > 0) {
      let message = {
        data: {
          title,
          type,
          text: body,
        },
        tokens: webUserDeviceToken,
        notification: {
          title: title,
          body: body,
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      };

      //if there are addtional data to send
      if (data) {
        message.data = { ...message.data, data };
      }

      // send notification
      FCM.sendEachForMulticast(message)
        .then(async (response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }

    // payload to send notification to ios devices
    if (iosUserDeviceToken.length > 0) {
      let message = {
        tokens: iosUserDeviceToken, //for sending notifications on multiple devices
        priority: 'high', //imp
        content_available: true,
        data: {
          title,
          type,
          text: body,
        },
        apns: {
          headers: {
            'apns-priority': '5',
          },

          // add notification body and title to alert
          payload: {
            aps: {
              alert: {
                title,
                body,
                'loc-args': [type],
              },
              badge: 0,
              sound: 'default',
            },
          },
        },
      };

      //if there are addtional data to send
      if (data) {
        message.data = { ...message.data, data };
        message.apns.payload.aps.alert = {
          ...message.apns.payload.aps.alert,
          data,
        };
      }

      // send notification
      FCM.sendEachForMulticast(message)
        .then(async (response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error?.responses?.[0] || error);
        });
    }

    return { isError: false, data: true };
  } catch (error) {
    console.log('error in twilio send helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = { send };
