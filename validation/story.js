const validText = require('./valid-text');
const Validator = require('validator');

const checkStory = (data) => {
  let errors = {};

  let { title, description } = data;

  title = validText(title) ? title : '';
  description = validText(description) ? description : '';

  if (!Validator.isLength(title, { min: 4, max: 60 })) {
    errors.title = 'Title must be between 4 and 60 characters long';
  }

  if (Validator.isEmpty(title)) {
    errors.title = 'Title is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = checkStory;
