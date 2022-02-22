const validText = require('./valid-text');
const Validator = require('validator');

const checkStory = (data) => {
  let errors = {};

  let { title, description, state, owner, difficulty, priority } = data;

  title = validText(title) ? title : '';
  description = validText(description) ? description : '';
  state = validText(state) ? state : '';
  owner = validText(owner) ? owner : '';
  difficulty = validText(difficulty) ? difficulty : '';
  priority = validText(priority) ? priority : '';

  if (!Validator.isLength(title, { min: 4, max: 30 })) {
    errors.title = 'Title must be between 4 and 30 characters long';
  }

  if (Validator.isEmpty(title)) {
    errors.title = 'Title field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = checkStory;
