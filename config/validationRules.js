const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

const VALIDATION_RULES = {
  USERS: {
    ID: 'required|string',
    NAME: 'required|string',
    ROLE: 'required|string',
    EMAIL: 'required|string|email',
    COUNTRY_CODE: 'required|string',
    PHONE: 'required|string',
    PASSWORD: [
      'required',
      'string',
      'min:8',
      'max:16',
      `regex:${passwordRegex}`,
    ],
    FORGOT_PWD_TOKEN: 'required|string',
  },
  ADMIN: {
    ID: 'required|string',
    EMAIL: 'required|string|email',
    PASSWORD: [
      'required',
      'string',
      'min:8',
      'max:16',
      `regex:${passwordRegex}`,
    ],
    FORGOT_PWD_TOKEN: 'required|string',
  },
};

module.exports = { VALIDATION_RULES };
