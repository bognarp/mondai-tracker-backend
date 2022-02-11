const validText = require('./valid-text');
const Validator = require('validator');

const checkLogin = (data) => {
  let errors = {};

  let { email, password } = data;

  email = validText(email) ? email : '';
  password = validText(password) ? password : '';

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = checkLogin;
