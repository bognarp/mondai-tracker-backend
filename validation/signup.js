const validText = require('./valid-text');
const Validator = require('validator');

const validateSignupInput = (data) => {
  let errors = {};

  let { username, email, password, password2 } = data;

  username = validText(username) ? username : '';
  email = validText(email) ? email : '';
  password = validText(password) ? password : '';
  password2 = validText(password2) ? password2 : '';

  if (!Validator.isLength(username, { min: 4, max: 30 })) {
    errors.username = 'Username must be between 4 and 30 characters long';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(password)) {
    password = 'Password field is required';
  }

  if (!Validator.isLength(password, { min: 5, max: 30 })) {
    errors.password = 'Password must be between 5 and 30 characters';
  }

  if (Validator.isEmpty(password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(password, password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = validateSignupInput;
