const validText = require('./valid-text');
const Validator = require('validator');

const checkUserUpdate = (data) => {
  let errors = {};

  let { username, name, email } = data;

  username = validText(username) ? username : null;
  name = validText(name) ? name : null;
  email = validText(email) ? email : null;

  if (username && !Validator.isLength(username, { min: 4, max: 30 })) {
    errors.username = 'Username must be between 4 and 30 characters long';
  }

  if (email && !Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = checkUserUpdate;
